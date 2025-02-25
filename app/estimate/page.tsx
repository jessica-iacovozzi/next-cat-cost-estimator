"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CatCostForm from "@/components/cat-cost-form";
import { getAnnualExpenseBreakdown, createUserEstimate, type AnnualExpenseBreakdown } from "@/lib/calculateAnnualCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Estimate() {
  const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (data: { 
    lifeStage: "Kitten" | "Adult" | "Senior";
    sex: "Male" | "Female";
    lifestyle: "Indoor" | "Outdoor";
    insurance: boolean;
  }) => {
    setLoading(true);

    try {
      const breakdown = await getAnnualExpenseBreakdown(data);
      setBreakdown(breakdown);
      localStorage.setItem('catCostBreakdown', JSON.stringify(breakdown));
    } catch (error) {
      console.error("Error calculating cost:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-20 items-center p-6">
      <CatCostForm onSubmit={handleSubmit} />

      {loading ? (
        <Button variant="outline" disabled className="w-full">
          Calculating...
        </Button>
      ) : breakdown.length > 0 ? (
        <Card className="flex-1 w-full shadow-md rounded-xl">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="px-3">Estimated Annual Cost Breakdown</CardTitle>
            <Button 
              variant="outline" 
              onClick={async () => {
                const estimateId = await createUserEstimate();
                router.push(`/protected/dashboard?estimateId=${estimateId}`);
              }}
            >
              Customize
            </Button>
          </CardHeader>
          <CardContent className="text-secondary">
            <table className="w-full text-left table-auto min-w-max">
              <tbody>
              {breakdown
                  .filter((item) => item.cost !== 0)
                  .map((item) => (
                  <tr key={item.name}>
                      <td className="p-3 border-b border-slate-200">
                      <p className="block text-sm text-slate-800">
                          {item.name}
                      </p>
                      </td>
                      <td className="p-3 border-b border-slate-200 text-center">
                      <p className="block text-sm text-slate-800">
                          {item.cost}$
                      </p>
                      </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
              <tr>
                  <td className="p-4 text-left font-bold text-slate-800 border-t border-slate-300">
                  Total:
                  </td>
                  <td className="p-4 font-semibold text-slate-800 border-t border-slate-300">
                  {breakdown.reduce((acc, item) => acc + item.cost, 0)}$
                  </td>
              </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
}
