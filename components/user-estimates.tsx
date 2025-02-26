"use client";

import { createUserExpenses, getUserExpenses, getUserEstimateIds, deleteEstimate, deleteExpenses, deleteExpense } from "@/lib/calculateAnnualCosts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CustomExpenseForm from "./custom-expense-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export interface Estimate {
    id: number;
    user_estimate_id: number;
    name: string;
    cost: number;
}

export default function UserEstimates() {
    const [estimates, setEstimates] = useState<Estimate[][]>([]);
    const [activeEstimateIndex, setActiveEstimateIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const estimate_ids = await getUserEstimateIds();
            if (!estimate_ids) {
                setIsLoading(false);
                return;
            }
            const allEstimates: Estimate[][] = [];
            for (const id of estimate_ids) {
                const user_expenses: Estimate[] = await getUserExpenses(id.id);
                if (user_expenses) {
                    allEstimates.push(user_expenses);
                }
            }
            setEstimates(allEstimates);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleSubmit = async (data: { name: string; cost: number, user_estimate_id: number }) => {
        setIsLoading(true);
        
        try {
            setActiveEstimateIndex(null);
            const newEstimate: Estimate = {
                id: Date.now(), // temporary ID
                user_estimate_id: data.user_estimate_id,
                name: data.name,
                cost: data.cost
            };
            setEstimates((prev) => {
                return prev.map((estimateArray) => {
                    if (estimateArray[0]?.user_estimate_id === data.user_estimate_id) {
                        return [...estimateArray, newEstimate];
                    }
                    return estimateArray;
                });
            });
        } catch (error) {
            console.error("Error submitting expense:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteExpense = async (expenseId: number) => {
        setIsLoading(true);
        
        try {
            await deleteExpense(expenseId);
            setEstimates((prev) => prev.map((estimateArray) => {
                return estimateArray.filter((expense) => expense.id !== expenseId);
            }));
        } catch (error) {
            console.error("Error deleting expense:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <p>Loading...</p>;

    if (estimates.length > 0) return (
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-16 lg:gap-24">
        {estimates.map((estimate, index) => (
            <div key={index} className="flex h-full">
                <Dialog open={activeEstimateIndex === index} onOpenChange={(open) => {
                    if (!open) {
                        setActiveEstimateIndex(null);
                    }
                }}>
                    <DialogContent aria-describedby="Custom Expense Creation Form">
                        <DialogTitle>Custom Expense</DialogTitle>
                        <DialogDescription>Create a custom expense for this estimate.</DialogDescription>
                        <CustomExpenseForm onSubmit={(formData) => handleSubmit({ 
                                ...formData, 
                                user_estimate_id: estimate[0].user_estimate_id 
                            })}  />
                    </DialogContent>
                </Dialog>
                <Card className="flex-1 w-full shadow-md rounded-xl flex flex-col h-full">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="px-3">My Custom Estimate {index + 1}</CardTitle>
                    <Button onClick={() => setActiveEstimateIndex(index)}>Add expense</Button>
                </CardHeader>
                <CardContent className="text-secondary flex-1 flex flex-col justify-between">
                    <table className="w-full text-left table-auto">
                        <tbody>
                        {estimate
                            .map((item, index) => (
                            <tr key={index}>
                                <td className="p-3 border-b border-slate-200 w-5/6">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => {
                                            const user_estimate_id = estimate[0]?.user_estimate_id;
                                            if (!user_estimate_id) return;
                                            
                                            setEstimates(prev => prev.map(estimateArray => {
                                                if (estimateArray[0]?.user_estimate_id === user_estimate_id) {
                                                    const newArray = [...estimateArray];
                                                    newArray[index].name = e.target.value;
                                                    return newArray;
                                                }
                                                return estimateArray;
                                            }));
                                        }}
                                        className="block w-full text-sm text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="p-3 border-b border-slate-200 w-1/6">
                                    <input
                                        type="number"
                                        value={item.cost}
                                        onChange={(e) => {
                                            const user_estimate_id = estimate[0]?.user_estimate_id;
                                            if (!user_estimate_id) return;
                                            
                                            setEstimates(prev => prev.map(estimateArray => {
                                                if (estimateArray[0]?.user_estimate_id === user_estimate_id) {
                                                    const newArray = [...estimateArray];
                                                    newArray[index].cost = Number(e.target.value);
                                                    return newArray;
                                                }
                                                return estimateArray;
                                            }));
                                        }}
                                        className="block w-full text-sm text-end text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="p-3 border-b border-slate-200 w-10 text-center">
                                    <button 
                                        onClick={() => handleDeleteExpense(item.id)}
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
                            {estimate.reduce((acc, item) => acc + item.cost, 0)}$
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                    <div>
                    <Button
                        className="w-full mt-4 text-foreground"
                        variant="outline"
                        onClick={async () => {
                        setIsLoading(true);
                        try {
                            await createUserExpenses(estimate, estimate[0].user_estimate_id);
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
                    <Button
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-foreground" 
                        onClick={async () => {
                        setIsLoading(true);
                        try {
                            const user_estimate_id = estimate[0]?.user_estimate_id;
                            
                            if (!user_estimate_id) {
                                console.error('Error: Could not find user_estimate_id');
                                return;
                            }
                            
                            await deleteExpenses(user_estimate_id);
                            await deleteEstimate(user_estimate_id);
                            
                            setEstimates(estimates.filter((estimateArray) => 
                                estimateArray[0]?.user_estimate_id !== user_estimate_id
                            ));
                        } catch (error) {
                            console.error('Error deleting custom estimate:', error);
                        } finally {
                            setIsLoading(false);
                        }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                    </div>
                </CardContent>
                </Card>
            </div>
        ))}
        </div>
    );

    return (
        <p className="text-muted-foreground font-semibold">No estimates found</p>
    );
}