"use client";

import { useEffect, useState } from "react";
import { type AnnualExpenseBreakdown, createUserExpenses } from "@/lib/calculateAnnualCosts";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import CustomExpenseForm from "./custom-expense-form";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

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

    const handleDeleteExpense = (index: number) => {
        const newBreakdown = [...breakdown];
        newBreakdown.splice(index, 1);
        setBreakdown(newBreakdown);
        localStorage.setItem('catCostBreakdown', JSON.stringify(newBreakdown));
    };

    if (isLoading) return <p>Loading...</p>;

    if (estimateId) return (
        <div className="grid grid-cols-1 w-50">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent aria-describedby="Custom Expense Creation Form">
                <DialogTitle>Custom Expense</DialogTitle>
                <DialogDescription>Create a custom expense for this estimate.</DialogDescription>
                <CustomExpenseForm onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
        <Card className="flex-1 w-full min-w-fit shadow-md rounded-xl">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="px-3">My Customized Estimate</CardTitle>
            <Button onClick={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}>Add expense</Button>
          </CardHeader>
          <CardContent className="text-secondary">
            <table className="w-full text-left table-auto">
                <tbody>
                {breakdown
                    .map((item, index) => (
                    <tr key={index}>
                        <td className="p-3 border-b border-slate-200 w-5/6">
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                    const newBreakdown = [...breakdown];
                                    newBreakdown[index].name = e.target.value;
                                    setBreakdown(newBreakdown);
                                }}
                                className="block w-full text-sm text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
                            />
                        </td>
                        <td className="p-3 border-b border-slate-200 w-1/6">
                            <input
                                type="number"
                                value={item.cost}
                                onChange={(e) => {
                                    const newBreakdown = [...breakdown];
                                    newBreakdown[index].cost = Number(e.target.value);
                                    setBreakdown(newBreakdown);
                                }}
                                className="block w-full text-sm text-end text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
                            />
                        </td>
                        <td className="p-3 border-b border-slate-200 w-10 text-center">
                            <button 
                                onClick={() => handleDeleteExpense(index)}
                                className="text-slate-500 hover:text-red-500 transition-colors"
                                aria-label="Delete expense"
                            >
                                <Trash2 size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td className="p-4 text-left font-bold text-slate-800 border-t border-slate-300">
                    Total:
                    </td>
                    <td className="p-4 text-end font-semibold text-slate-800 border-t border-slate-300">
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
      </div>
    );
}