"use client";

import { createUserExpenses, getUserExpenses, getUserEstimateIds, deleteEstimate, deleteExpenses } from "@/lib/calculateAnnualCosts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CustomExpenseForm from "./custom-expense-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

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

    if (isLoading) return <p>Loading...</p>;

    if (estimates.length > 0) return (
        <>
        {estimates.map((estimate, index) => (
            <div key={index}>
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
                <Card className="flex-1 w-full shadow-md rounded-xl">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="px-3">My Custom Estimate {index + 1}</CardTitle>
                    <Button onClick={() => setActiveEstimateIndex(index)}>Add expense</Button>
                </CardHeader>
                <CardContent className="text-secondary">
                    <table className="w-full text-left table-auto min-w-max">
                        <tbody>
                        {estimate
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
                            {estimate.reduce((acc, item) => acc + item.cost, 0)}$
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                    <Button
                        className="w-full mt-4 text-foreground"
                        variant="outline"
                        onClick={async () => {
                        setIsLoading(true);
                        try {
                            await createUserExpenses(estimate, estimate[index].user_estimate_id);
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
                            await deleteExpenses(estimate[index].user_estimate_id);
                            await deleteEstimate(estimate[index].user_estimate_id);
                            setEstimates(estimates.filter((item) => item[index].user_estimate_id !== estimate[index].user_estimate_id));
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
                </CardContent>
                </Card>
            </div>
        ))}
        </>
    );

    return (
        <p className="text-muted-foreground font-semibold">No estimates found</p>
    );
}