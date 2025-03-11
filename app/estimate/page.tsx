"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CatCostForm from "@/components/cat-cost-form";
import { getAnnualExpenseBreakdown, createUserEstimate, generateEstimateName, type AnnualExpenseBreakdown } from "@/lib/calculateAnnualCosts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CatCostFormValues } from "@/components/cat-cost-form";
import { useUser } from "@/hooks/useUser";
import { BreakdownSkeletonLoader } from "@/components/ui/skeleton";
import InfoTooltip from "@/components/ui/info-tooltip";
import { InfoIcon } from "lucide-react";

export default function Estimate() {
  const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CatCostFormValues | null>(null);
  const [estimateCreated, setEstimateCreated] = useState(false); 
  const [estimateName, setEstimateName] = useState<string>("");
  const estimateRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const storedFormData = localStorage.getItem('pendingCatCostFormData');
    if (storedFormData && user && !estimateCreated) { 
      try {
        const parsedData = JSON.parse(storedFormData) as CatCostFormValues;
        const createEstimate = async () => {
          setEstimateCreated(true); 
          const name = generateEstimateName(parsedData);
          setEstimateName(name);
          const { id } = await createUserEstimate(name);
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

  useEffect(() => {
    if (breakdown.length > 0 && !loading && estimateRef.current) {
      estimateRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [breakdown.length, loading]);

  const handleSubmit = async (data: CatCostFormValues) => {
    setLoading(true);
    setFormData(data);
    setEstimateCreated(false);

    const name = generateEstimateName(data);
    setEstimateName(name);

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
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row lg:gap-8 items-start">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:sticky lg:top-24">
          <CatCostForm onSubmit={handleSubmit} />
        </div>
        
        {/* Estimate section */}
        <div className="w-full lg:w-1/2" ref={estimateRef}>
          {loading ? (
            <BreakdownSkeletonLoader />
          ) : breakdown.length > 0 ? (
            <Card className="w-full shadow-md rounded-xl">
              <CardHeader className="flex flex-col">
                <div className="flex">
                  <CardTitle className="px-3 w-2/3">Estimated Annual Cost Breakdown</CardTitle>
                  {user ? (
                    <Button 
                      aria-label="Customize Estimate"
                      className="w-1/3"
                      onClick={async () => {
                        if (!estimateCreated) {
                          setEstimateCreated(true);
                          const { id } = await createUserEstimate(estimateName);
                          router.push(`/protected/estimates?estimateId=${id}&estimateName=${estimateName}`);
                        } else {
                          router.push('/protected/estimates');
                        }
                      }}
                    >
                      Customize
                    </Button>
                  ) : (
                    <Button 
                      aria-label="Sign in to customize estimate" 
                      className="sm:w-1/3 text-wrap h-auto"
                      variant="outline" 
                      onClick={() => {
                        localStorage.setItem('pendingCatCostFormData', JSON.stringify(formData));
                        router.push('/sign-in?returnTo=/estimate');
                      }}
                    >
                      Sign in to customize
                    </Button>
                  )}
                </div>
                <CardDescription className="px-3 py-1">{estimateName}</CardDescription>
              </CardHeader>
              <CardContent className="text-secondary">
                <table className="w-full text-left table-auto">
                  <tbody>
                  {breakdown
                      .map((item) => (
                      <tr key={item.name}>
                          <td className="p-3 border-b border-slate-200">
                          <p className="block text-sm text-slate-800 flex items-center gap-1">
                              {item.name}
                              {item.tooltip && item.tooltip.length > 0 && (
                                <InfoTooltip content={item.tooltip}>
                                  <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                                </InfoTooltip>
                              )}
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
                      <td className="p-4 text-left font-bold text-red-600 border-t border-slate-300">
                      Total:
                      </td>
                      <td className="p-4 font-semibold text-red-600 border-t border-slate-300">
                      {breakdown.reduce((acc, item) => acc + item.cost, 0)}$
                      </td>
                  </tr>
                  </tfoot>
                </table>
              </CardContent>
            </Card>
          ) : (
            <div className="hidden lg:flex lg:h-full lg:items-center lg:justify-center lg:p-12">
              <p className="text-muted-foreground text-center">
                Fill out the form to see your cat's estimated annual cost breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
