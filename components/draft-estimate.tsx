"use client";

import { useEffect, useState } from "react";
import { type AnnualExpenseBreakdown, createUserExpenses } from "@/lib/calculateAnnualCosts";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import CustomExpenseForm from "./custom-expense-form";
import { useRouter } from "next/navigation";

interface DraftEstimateProps {
    estimateId: string;
}

export default function DraftEstimate({ estimateId }: DraftEstimateProps) {
    const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    
    useEffect(() => {
        setIsLoading(true);
        const storedData = localStorage.getItem("catCostBreakdown");
        if (storedData) {
          setBreakdown(JSON.parse(storedData));
          localStorage.removeItem("catCostBreakdown");
        }
        setIsLoading(false);
      }, []);

    const handleSubmit = async (data: { 
        name: string;
        cost: number;
        }) => {
        setIsLoading(true);
        
        try {
            setIsOpen(false);
            setBreakdown((prev) => [...prev, data]);
            localStorage.setItem('catCostBreakdown', JSON.stringify(breakdown));
        } catch (error) {
            console.error("Error submitting expense:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <p>Loading...</p>;

    if (estimateId) return (
        <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent aria-describedby="Custom Expense Creation Form">
                <DialogTitle>Custom Expense</DialogTitle>
                <CustomExpenseForm onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
        <Card className="flex-1 w-full shadow-md rounded-xl">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="px-3">My Customized Estimate</CardTitle>
            <Button onClick={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}>Add expense</Button>
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
            <Button
                className="w-full mt-4" 
                onClick={async () => {
                setIsLoading(true);
                try {
                    await createUserExpenses(breakdown, parseInt(estimateId));
                    router.replace('/protected/estimates', undefined);
                } catch (error) {
                    console.error('Error saving custom estimate:', error);
                } finally {
                    setIsLoading(false);
                }
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save Custom Estimate'}
            </Button>
          </CardContent>
        </Card>
      </>
    );
}