import { createClient } from "@/utils/supabase/client";
import { CatCostFormValues } from "@/components/cat-cost-form";

const supabase = createClient();

async function getInsuranceExpenseId() {
  const { data, error } = await supabase
    .from('expenses')
    .select('id')
    .eq('name', 'Insurance program (basic)')
    .single();

  if (error || !data) throw new Error('Insurance expense not found in database');
  return data.id;
}

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

export async function calculateAnnualCost(data: CatCostFormValues) {
  
    try {
    const { lifeStage, sex, lifestyle, insurance } = data;

    // Fetch life_stage_id
    const { data: lifeStageData, error: lifeStageError } = await supabase
      .from("life_stages")
      .select("id")
      .eq("name", lifeStage)
      .single();

    if (lifeStageError || !lifeStageData) throw new Error("Life stage not found");

    const lifeStageId = lifeStageData.id;

    // Fetch annual costs based on life stage and lifestyle
    const { data: annualCosts, error: annualCostsError } = await supabase
      .from("annual_costs")
      .select("cost")
      .eq("life_stage_id", lifeStageId)
      .eq("lifestyle", lifestyle);

    if (annualCostsError) throw new Error("Error fetching annual costs");

    // Calculate total annual costs
    let totalCost = annualCosts.reduce((sum, item) => sum + Number(item.cost), 0);

    // Fetch sterilization cost if the cat is a Kitten
    if (lifeStage === "Kitten") {
      const { data: sterilizationCost, error: sterilizationError } = await supabase
        .from("sterilization_costs")
        .select("cost")
        .eq("life_stage_id", lifeStageId)
        .eq("sex", sex)
        .single();

      if (sterilizationError) {
        throw new Error("Error fetching sterilization cost: " + sterilizationError.message);
      }

      if (sterilizationCost) {
        totalCost += Number(sterilizationCost.cost);
      }
    }

    // Add insurance cost if applicable
    if (insurance) {
      try {
        const expenseId = await getInsuranceExpenseId();
        const insuranceCost = await getAnnualInsuranceCost(lifeStageId, lifestyle, expenseId);
        totalCost += insuranceCost;
      } catch (error) {
        console.error('Error fetching insurance costs:', error);
        throw new Error('Failed to calculate insurance costs. Using default value.');
      }
    }

    return totalCost;
  } catch (error: any) {
    console.error("Error calculating annual cost:", error.message);
    return null;
  }
}
