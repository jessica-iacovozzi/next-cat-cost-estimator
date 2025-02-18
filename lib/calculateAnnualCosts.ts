import { createClient } from "@/utils/supabase/client";
import { CatCostFormValues } from "@/components/cat-cost-form";

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

    if (expensesError || !expenses) throw new Error('Failed to fetch expenses');

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

    return breakdown;
  } catch (error) {
    console.error('Error calculating breakdown:', error);
    throw error;
  }
}
