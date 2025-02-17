"use client";

import { useState } from "react";
import CatCostForm from "@/components/cat-cost-form";
import { calculateAnnualCost } from "@/lib/calculateAnnualCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Estimate() {
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: { 
    lifeStage: "Kitten" | "Adult" | "Senior";
    sex: "Male" | "Female";
    lifestyle: "Indoor" | "Outdoor";
    insurance: boolean;
  }) => {
    console.log("Form data:", data);
    setLoading(true);

    try {
      const calculatedCost = await calculateAnnualCost(data);
      setTotalCost(calculatedCost !== null ? calculatedCost : null);
    } catch (error) {
      console.error("Error calculating cost:", error);
      setTotalCost(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 items-center p-6">
      <CatCostForm onSubmit={handleSubmit} />

      {/* Display the total cost result */}
      {totalCost !== null && (
        <Card className="w-full shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Estimated Annual Cost</CardTitle>
          </CardHeader>
          <CardContent className="text-secondary">
            ${totalCost}
          </CardContent>
        </Card>
      )}

      {loading && (
        <Button variant="outline" disabled className="w-full">
          Calculating...
        </Button>
      )}
    </div>
  );
}
