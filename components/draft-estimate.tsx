"use client";

import { useEffect, useState } from "react";
import { type AnnualExpenseBreakdown, createUserExpenses, deleteEstimate } from "@/lib/calculateAnnualCosts";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import CustomExpenseForm from "./custom-expense-form";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "./ui/toast-context";

interface DraftEstimateProps {
    estimateId: string;
    estimateName: string;
}

export default function DraftEstimate({ estimateId, estimateName }: DraftEstimateProps) {
    const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const router = useRouter();
    const { addToast } = useToast();
    
    useEffect(() => {
        setIsLoading(true);
        const storedData = localStorage.getItem("catCostBreakdown");
        if (storedData) {
          setBreakdown(JSON.parse(storedData));
          localStorage.removeItem("catCostBreakdown");
        }
        setIsLoading(false);
      }, []);

    const handleCreateExpense = async (data: { 
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
        <div className="grid grid-cols-1 w-full">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent aria-describedby="Custom Expense Creation Form">
                <DialogTitle>Custom Expense</DialogTitle>
                <DialogDescription>Create a custom expense for this estimate.</DialogDescription>
                <CustomExpenseForm onSubmit={handleCreateExpense} />
            </DialogContent>
        </Dialog>
        <Card className="flex-1 w-full min-w-fit shadow-md rounded-xl">
          <CardHeader className="flex justify-between items-center">
            <div>
                <CardTitle className="px-3">Estimated Annual Cost Breakdown</CardTitle>
                <CardDescription className="px-3">{estimateName}</CardDescription>
            </div>
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
                    addToast({
                      title: "Success",
                      description: "Draft estimate saved successfully! Redirecting to saved estimates...",
                      variant: "success",
                      duration: 4000
                    });
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                      router.push('/protected/estimates');
                    }, 2000);
                } catch (error) {
                    console.error('Error saving custom estimate:', error);
                    addToast({
                      title: "Error",
                      description: "Failed to save draft estimate.",
                      variant: "destructive",
                      duration: 3000
                    });
                } finally {
                    setIsLoading(false);
                }
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Saving...' : 'Save Draft Estimate'}
            </Button>
            
            <Button
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-foreground"
                onClick={async () => {
                setIsLoading(true);
                try {
                    await deleteEstimate(parseInt(estimateId));
                    addToast({
                      title: "Success",
                      description: "Draft estimate deleted successfully! Redirecting to saved estimates...",
                      variant: "success",
                      duration: 4000
                    });
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                      router.push('/protected/estimates');
                    }, 2000);
                } catch (error) {
                    console.error('Error deleting custom estimate:', error);
                    addToast({
                      title: "Error",
                      description: "Failed to delete draft estimate.",
                      variant: "destructive",
                      duration: 3000
                    });
                } finally {
                    setIsLoading(false);
                }
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Deleting...' : 'Delete Draft Estimate'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
}