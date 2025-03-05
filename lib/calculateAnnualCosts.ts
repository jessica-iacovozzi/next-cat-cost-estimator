import { createClient } from "@/utils/supabase/client";
import { CatCostFormValues } from "@/components/cat-cost-form";
import { CustomExpenseFormValues } from "@/components/custom-expense-form";
import { Estimate } from "@/components/user-estimates";

const supabase = createClient();

async function getAnnualInsuranceCost(
  lifeStageId: number,
  lifestyle: 'Indoor' | 'Outdoor',
  expenseId: number
) {
  const { data, error } = await supabase
    .from('annual_costs')
    .select('cost')
    .match({
      life_stage_id: lifeStageId,
      expense_id: expenseId,
      lifestyle: lifestyle
    })
    .single();

  if (error || !data) throw new Error('No annual cost found for insurance program');
  return data.cost;
}

async function getLifeStageId(lifeStage: string) {
  const { data, error } = await supabase
    .from("life_stages")
    .select("id")
    .eq("name", lifeStage)
    .single();

  if (error || !data) throw new Error("Life stage not found");
  return data.id;
}

async function getSterilizationCost(lifeStageId: number, sex: 'Male' | 'Female') {
  const { data, error } = await supabase
    .from('sterilization_costs')
    .select('cost')
    .match({ life_stage_id: lifeStageId, sex })
    .single();

  if (error || !data) throw new Error('Sterilization cost not found');
  return data.cost;
}

export interface AnnualExpenseBreakdown {
  name: string;
  cost: number;
  tooltip?: {
    text: string;
    link?: string;
  }[];
}

export async function getAnnualExpenseBreakdown(data: CatCostFormValues): Promise<AnnualExpenseBreakdown[]> {
  try {
    const { lifeStage, sex, lifestyle, insurance } = data;
    const lifeStageId = await getLifeStageId(lifeStage);
    
    // Get all expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, name, tooltip');

    if (expensesError || !expenses) throw new Error(`Failed to fetch expenses: ${expensesError.message}`);

    const breakdown: AnnualExpenseBreakdown[] = [];

    for (const expense of expenses) {
      let cost = 0;

      // Handle sterilization cost
      if (expense.name.toLowerCase().includes('sterilization')) {
        if (lifeStage === 'Kitten') {
          cost = await getSterilizationCost(lifeStageId, sex);
        } else {
          continue; // Skip sterilization for non-kittens
        }
      }
      // Handle insurance
      else if (expense.name === 'Insurance program (basic)') {
        if (!insurance) continue;
        cost = await getAnnualInsuranceCost(lifeStageId, lifestyle, expense.id);
      }
      // Regular annual costs
      else {
        const { data: annualCost } = await supabase
          .from('annual_costs')
          .select('cost')
          .match({
            life_stage_id: lifeStageId,
            expense_id: expense.id,
            lifestyle
          })
          .maybeSingle();

        cost = annualCost?.cost || 0;
      }

      breakdown.push({
        name: expense.name,
        cost,
        tooltip: expense.tooltip
      });
    }

    return breakdown.filter(item => item.cost > 0);
  } catch (error) {
    console.error('Error calculating breakdown:', error);
    throw error;
  }
}

export function generateEstimateName(formData: CatCostFormValues): string {
  return `${formData.sex} ${formData.lifestyle} ${formData.lifeStage} ${formData.lifeStage === 'Kitten' ? ' ' : 'Cat'} ${formData.insurance ? 'with Insurance' : ''}`;
}

export async function createUserEstimate(formData: CatCostFormValues, estimateName: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("user_estimates")
    .insert({
      user_id: user.id, 
      name: estimateName
    })
    .select('id')
    .single();

  if (error || !data?.id) throw new Error(`User estimate not created: ${error?.message}`);
  
  return { id: data.id };
}

export async function createUserExpense(expense: CustomExpenseFormValues, estimateId: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  // Get all existing expenses for this estimate to determine alphabetical position
  const { data: existingExpenses } = await supabase
    .from("user_expenses")
    .select('name, order')
    .eq('user_estimate_id', estimateId)
    .order('name', { ascending: true });

  // Determine the alphabetical position for the new expense
  let newOrder = 0;
  let inserted = false;
  
  if (existingExpenses && existingExpenses.length > 0) {
    // Find the position where the new expense should be inserted alphabetically
    for (let i = 0; i < existingExpenses.length; i++) {
      if (expense.name.toLowerCase() < existingExpenses[i].name.toLowerCase()) {
        newOrder = i;
        inserted = true;
        break;
      }
    }
    
    // If the new expense should be at the end alphabetically
    if (!inserted) {
      newOrder = existingExpenses.length;
    }
    
    // If we're inserting in the middle, we need to increment the order of all expenses after this position
    if (inserted) {
      const { data: expensesToUpdate } = await supabase
        .from("user_expenses")
        .select('id, order')
        .eq('user_estimate_id', estimateId)
        .gte('order', newOrder)
        .order('order', { ascending: true });
      
      if (expensesToUpdate && expensesToUpdate.length > 0) {
        // Update each expense's order one by one
        for (const expense of expensesToUpdate) {
          await supabase
            .from("user_expenses")
            .update({ order: expense.order + 1 })
            .eq('id', expense.id);
        }
      }
    }
  }

  const { data, error } = await supabase
    .from("user_expenses")
    .insert({
        user_estimate_id: estimateId,
        name: expense.name,
        cost: expense.cost,
        order: newOrder
    });

  if (error) throw new Error(`Failed to create user expense: ${error.message}`);
  
  // Update the updated_at timestamp of the related user estimate
  const { error: updateEstimateError } = await supabase
    .from("user_estimates")
    .update({ updated_at: new Date().toISOString() })
    .eq('id', estimateId);
  
  if (updateEstimateError) throw new Error(`Failed to update estimate timestamp: ${updateEstimateError.message}`);
  
  return data;
}

export async function createUserExpenses(expenses: CustomExpenseFormValues[], estimateId: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  // Get all existing expenses for this estimate
  const { data: existingExpenses } = await supabase
    .from("user_expenses")
    .select('name, order')
    .eq('user_estimate_id', estimateId);
  
  // Sort all expenses (existing + new) alphabetically
  const allExpenses = [...(existingExpenses || []).map(e => ({ name: e.name, existingOrder: e.order, isNew: false })),
                       ...expenses.map(e => ({ name: e.name, cost: e.cost, isNew: true }))];
  
  allExpenses.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  
  // Assign new order values to all expenses
  const newOrderMap = new Map();
  allExpenses.forEach((expense, index) => {
    if (!expense.isNew) {
      // If existing expense's order changes, we'll update it later
      newOrderMap.set(expense.name, index);
    }
  });
  
  // First, update existing expenses if their order has changed
  if (existingExpenses && existingExpenses.length > 0) {
    for (const expense of existingExpenses) {
      const newOrder = newOrderMap.get(expense.name);
      if (newOrder !== undefined && newOrder !== expense.order) {
        await supabase
          .from("user_expenses")
          .update({ order: newOrder })
          .eq('user_estimate_id', estimateId)
          .eq('name', expense.name);
      }
    }
  }
  
  // Then insert new expenses with their calculated order
  const expensesToInsert = expenses.map(expense => {
    const order = newOrderMap.get(expense.name) || 0;
    return {
      name: expense.name,
      cost: expense.cost,
      user_estimate_id: estimateId,
      order
    };
  });
  
  const { data, error } = await supabase
    .from("user_expenses")
    .insert(expensesToInsert)

  if (error) throw new Error(`Failed to create user expenses: ${error.message}`);
  
  // Update the updated_at timestamp of the related user estimate
  const { error: updateEstimateError } = await supabase
    .from("user_estimates")
    .update({ updated_at: new Date().toISOString() })
    .eq('id', estimateId);
  
  if (updateEstimateError) throw new Error(`Failed to update estimate timestamp: ${updateEstimateError.message}`);
  
  return data;
}

export async function getUserEstimates() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("user_estimates")
    .select('id, name, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error || !data) throw new Error(`No user estimates found: ${error?.message}`);
  return data;
}

export async function getUserExpenses(estimateId: number): Promise<Estimate[]> {
  const { data, error } = await supabase
    .from("user_expenses")
    .select('id, user_estimate_id, name, cost, order')
    .eq('user_estimate_id', estimateId)
    .order('order', { ascending: true })

  if (error || !data) throw new Error(`Failed to get user expenses: ${error.message}`);
  return data;
}

export async function deleteEstimate(estimateId: number) {
  const { error } = await supabase
    .from("user_estimates")
    .delete()
    .eq('id', estimateId)

  if (error) throw new Error(`Failed to delete estimate: ${error.message}`);
}

export async function deleteExpenses(estimateId: number) {
  const { error } = await supabase
    .from("user_expenses")
    .delete()
    .eq('user_estimate_id', estimateId)

  if (error) throw new Error(`Failed to delete expenses: ${error.message}`);
  
  // Update the updated_at timestamp of the related user estimate
  const { error: updateEstimateError } = await supabase
    .from("user_estimates")
    .update({ updated_at: new Date().toISOString() })
    .eq('id', estimateId);
  
  if (updateEstimateError) throw new Error(`Failed to update estimate timestamp: ${updateEstimateError.message}`);
}

export async function deleteExpense(expenseId: number) {
  // First, get the expense to find its user_estimate_id
  const { data: expense, error: fetchError } = await supabase
    .from("user_expenses")
    .select("user_estimate_id")
    .eq('id', expenseId)
    .single();

  if (fetchError) throw new Error(`Failed to fetch expense: ${fetchError.message}`);
  
  // Delete the expense
  const { error } = await supabase
    .from("user_expenses")
    .delete()
    .eq('id', expenseId)

  if (error) throw new Error(`Failed to delete expense: ${error.message}`);
  
  // Update the updated_at timestamp of the related user estimate
  const { error: updateEstimateError } = await supabase
    .from("user_estimates")
    .update({ updated_at: new Date().toISOString() })
    .eq('id', expense.user_estimate_id);
  
  if (updateEstimateError) throw new Error(`Failed to update estimate timestamp: ${updateEstimateError.message}`);
}

export async function updateExpense(expenseId: number, data: { name: string, cost: number }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  // First, get the expense to find its user_estimate_id
  const { data: expense, error: fetchError } = await supabase
    .from("user_expenses")
    .select("user_estimate_id")
    .eq('id', expenseId)
    .single();

  if (fetchError) throw new Error(`Failed to fetch expense: ${fetchError.message}`);
  
  // Update the expense
  const { data: updatedExpense, error } = await supabase
    .from("user_expenses")
    .update(data)
    .eq('id', expenseId);
    
  if (error) throw new Error(`Failed to update expense: ${error.message}`);
  
  // Update the updated_at timestamp of the related user estimate
  const { error: updateEstimateError } = await supabase
    .from("user_estimates")
    .update({ updated_at: new Date().toISOString() })
    .eq('id', expense.user_estimate_id);
  
  if (updateEstimateError) throw new Error(`Failed to update estimate timestamp: ${updateEstimateError.message}`);
  
  return updatedExpense;
}

export async function updateExpenseOrder(expenseId: number, newOrder: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  // First, get the expense to find its user_estimate_id and current order
  const { data: expense, error: fetchError } = await supabase
    .from("user_expenses")
    .select("user_estimate_id, order")
    .eq('id', expenseId)
    .single();

  if (fetchError) throw new Error(`Failed to fetch expense: ${fetchError.message}`);
  
  const currentOrder = expense.order;
  const estimateId = expense.user_estimate_id;
  
  // If the order hasn't changed, do nothing
  if (currentOrder === newOrder) {
    return;
  }
  
  // Use the reorder_expenses stored procedure to handle all the reordering in a single transaction
  const { error } = await supabase.rpc('reorder_expenses', {
    p_expense_id: expenseId,
    p_estimate_id: estimateId,
    p_old_order: currentOrder,
    p_new_order: newOrder
  });
  
  if (error) throw new Error(`Failed to reorder expenses: ${error.message}`);
  
  // Update the updated_at timestamp of the related user estimate
  const { error: updateEstimateError } = await supabase
    .from("user_estimates")
    .update({ updated_at: new Date().toISOString() })
    .eq('id', estimateId);
  
  if (updateEstimateError) throw new Error(`Failed to update estimate timestamp: ${updateEstimateError.message}`);
}