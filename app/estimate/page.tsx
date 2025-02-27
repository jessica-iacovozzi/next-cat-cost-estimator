"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CatCostForm from "@/components/cat-cost-form";
import { getAnnualExpenseBreakdown, createUserEstimate, type AnnualExpenseBreakdown } from "@/lib/calculateAnnualCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CatCostFormValues } from "@/components/cat-cost-form";
import { useUser } from "@/hooks/useUser";

export default function Estimate() {
  const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CatCostFormValues | null>(null);
  const [estimateCreated, setEstimateCreated] = useState(false); 
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const storedFormData = localStorage.getItem('pendingCatCostFormData');
    if (storedFormData && user && !estimateCreated) { 
      try {
        const parsedData = JSON.parse(storedFormData) as CatCostFormValues;
        
        const createEstimate = async () => {
          setEstimateCreated(true); 
          const { id, name } = await createUserEstimate(parsedData);
          router.push(`/protected/estimates?estimateId=${id}&estimateName=${name}`);
          localStorage.removeItem('pendingCatCostFormData');
        };
        
        createEstimate();
      } catch (error) {
        console.error('Error parsing stored form data:', error);
        localStorage.removeItem('pendingCatCostFormData');
      }
    }
  }, [user, router, estimateCreated]);

  useEffect(() => {
    if (user && breakdown.length === 0) {
      const storedBreakdown = localStorage.getItem('catCostBreakdown');
      if (storedBreakdown) {
        try {
          const parsedBreakdown = JSON.parse(storedBreakdown) as AnnualExpenseBreakdown[];
          setBreakdown(parsedBreakdown);
        } catch (error) {
          console.error('Error parsing stored breakdown data:', error);
          localStorage.removeItem('catCostBreakdown');
        }
      }
    }
  }, [user, breakdown.length]);

  const handleSubmit = async (data: CatCostFormValues) => {
    setLoading(true);
    setFormData(data);
    setEstimateCreated(false);

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
            {user ? (
              <Button 
                variant="outline" 
                onClick={async () => {
                  if (!estimateCreated) {
                    setEstimateCreated(true);
                    const { id, name } = await createUserEstimate(formData as CatCostFormValues);
                    router.push(`/protected/estimates?estimateId=${id}&estimateName=${name}`);
                  } else {
                    // If estimate was already created, just redirect to estimates page
                    router.push('/protected/estimates');
                  }
                }}
              >
                Customize
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.setItem('pendingCatCostFormData', JSON.stringify(formData));
                  router.push('/sign-in?returnTo=/estimate');
                }}
              >
                Sign in to customize
              </Button>
            )}
          </CardHeader>
          <CardContent className="text-secondary">
            <table className="w-full text-left table-auto">
              <tbody>
              {breakdown
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
