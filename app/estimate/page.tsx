"use client";

import { useState } from "react";
import CatCostForm from "@/components/cat-cost-form";
import { getAnnualExpenseBreakdown } from "@/lib/calculateAnnualCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnnualExpenseBreakdown } from "@/lib/calculateAnnualCosts";

export default function Estimate() {
  const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
    } catch (error) {
      console.error("Error calculating cost:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 items-center p-6">
      <CatCostForm onSubmit={handleSubmit} />

      {loading && (
        <Button variant="outline" disabled className="w-full">
          Calculating...
        </Button>
      )}

      {breakdown.length > 0 && (
        <Card className="w-full shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Estimated Annual Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="text-secondary">
            <ul>
              {breakdown
                .filter((item) => item.cost !== 0)
                .map((item) => (
                  <li key={item.name}>{item.name} - ${item.cost}</li>
                ))}
            </ul>
            <p>Total: ${breakdown.reduce((acc, item) => acc + item.cost, 0)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
