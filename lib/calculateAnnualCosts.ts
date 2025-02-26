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
}

export async function getAnnualExpenseBreakdown(data: CatCostFormValues): Promise<AnnualExpenseBreakdown[]> {
  try {
    const { lifeStage, sex, lifestyle, insurance } = data;
    const lifeStageId = await getLifeStageId(lifeStage);
    
    // Get all expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, name');

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
        cost
      });
    }

    return breakdown.filter(item => item.cost > 0);
  } catch (error) {
    console.error('Error calculating breakdown:', error);
    throw error;
  }
}

export async function createUserEstimate() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

    const { data, error } = await supabase
      .from("user_estimates")
      .insert({
        user_id: user.id
      })
      .select('id')

    if (error || !data?.[0]) throw new Error(`User estimate not created: ${error?.message}`);
  
  return data[0].id;
}

export async function createUserExpense(expense: CustomExpenseFormValues, estimateId: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("user_expenses")
    .insert({
        user_estimate_id: estimateId,
        name: expense.name,
        cost: expense.cost
    });

  if (error) throw new Error(`Failed to create user expense: ${error.message}`);
  return data;
}

export async function createUserExpenses(expenses: CustomExpenseFormValues[], estimateId: number) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("user_expenses")
    .insert(
      expenses.map(expense => ({
        name: expense.name,
        cost: expense.cost,
        user_estimate_id: estimateId
      }))
    )

  if (error) throw new Error(`Failed to create user expenses: ${error.message}`);
  return data;
}

export async function getUserEstimateIds() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data, error } = await supabase
    .from("user_estimates")
    .select('id')
    .eq('user_id', user.id)

  if (error || !data) throw new Error(`No user estimates found: ${error?.message}`);
  return data;
}

export async function getUserExpenses(estimateId: number): Promise<Estimate[]> {
  const { data, error } = await supabase
    .from("user_expenses")
    .select('id, user_estimate_id, name, cost')
    .eq('user_estimate_id', estimateId)

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
}

export async function deleteExpense(expenseId: number) {
  const { error } = await supabase
    .from("user_expenses")
    .delete()
    .eq('id', expenseId)

  if (error) throw new Error(`Failed to delete expense: ${error.message}`);
}

export async function updateExpense(expenseId: number, data: { name: string, cost: number }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not found");

  const { data: updatedExpense, error } = await supabase
    .from("user_expenses")
    .update(data)
    .eq('id', expenseId)
    
  if (error) throw new Error(`Failed to update expense: ${error.message}`);
  return updatedExpense;
}