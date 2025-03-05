"use client";

import { createUserExpense, getUserExpenses, getUserEstimates, deleteEstimate, deleteExpenses, deleteExpense, updateExpense, updateExpenseOrder } from "@/lib/calculateAnnualCosts";
import { useState, useEffect, useCallback, useRef } from "react";
import CustomExpenseForm from "./custom-expense-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, GripHorizontal } from "lucide-react";
import { EstimatesSkeletonLoader } from "./ui/skeleton";
import Link from "next/link";

export interface UserEstimate {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Estimate {
    id: number;
    user_estimate_id: number;
    name: string;
    cost: number;
    order: number;
}

export default function UserEstimates() {
    const [estimates, setEstimates] = useState<Estimate[][]>([]);
    const [activeEstimateIndex, setActiveEstimateIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [updatingExpenseIds, setUpdatingExpenseIds] = useState<number[]>([]);
    const [estimateNames, setEstimateNames] = useState<string[]>([]);
    const [estimateDates, setEstimateDates] = useState<string[]>([]);
    const [estimateUpdateDates, setEstimateUpdateDates] = useState<string[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [draggedExpense, setDraggedExpense] = useState<{ id: number, estimateIndex: number, expenseIndex: number } | null>(null);
    const [dragOverExpense, setDragOverExpense] = useState<{ id: number, estimateIndex: number, expenseIndex: number } | null>(null);
    
    const originalExpenseValues = useRef<Map<number, { name: string, cost: number }>>(new Map());

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }

    const fetchData = async () => {
        try {
            const estimates = await getUserEstimates() as UserEstimate[];
            if (!estimates) {
                setIsLoading(false);
                return;
            }
            const allEstimates: Estimate[][] = [];
            const names: string[] = [];
            const dates: string[] = [];
            const updateDates: string[] = [];

            originalExpenseValues.current.clear();

            for (const estimate of estimates) {
                const user_expenses: Estimate[] = await getUserExpenses(estimate.id);
                if (user_expenses.length > 0) {
                    user_expenses.forEach(expense => {
                        originalExpenseValues.current.set(expense.id, {
                            name: expense.name,
                            cost: expense.cost
                        });
                    });

                    allEstimates.push(user_expenses);
                    names.push(estimate.name || `Custom Estimate ${allEstimates.length}`);
                    const formattedDate = estimate.created_at 
                        ? new Date(estimate.created_at).toLocaleDateString(undefined, options) 
                        : 'No date available';
                    dates.push(formattedDate);

                    const formattedUpdateDate = estimate.updated_at 
                        ? new Date(estimate.updated_at).toLocaleDateString(undefined, options) 
                        : 'No update date available';
                    updateDates.push(formattedUpdateDate);
                }
            }
            setEstimateNames(names);
            setEstimateDates(dates);
            setEstimateUpdateDates(updateDates);
            setEstimates(allEstimates);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const handleCreateExpense = async (data: { name: string; cost: number, user_estimate_id: number }) => {
        setIsLoading(true);

        try {
            await createUserExpense(data, data.user_estimate_id);
            setActiveEstimateIndex(null);
            setRefreshTrigger(prev => prev + 1);
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
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting expense:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpenseReorder = async (draggedId: number, newOrder: number) => {
        try {
            setIsLoading(true);
            
            setDraggedExpense(null);
            setDragOverExpense(null);
            
            await updateExpenseOrder(draggedId, newOrder);
            
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error reordering expense:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExpenseUpdate = useCallback(
        async (expenseId: number, data: { name: string, cost: number }) => {
            try {
                setUpdatingExpenseIds(prev => [...prev, expenseId]);
                await updateExpense(expenseId, data);

                originalExpenseValues.current.set(expenseId, {
                    name: data.name,
                    cost: data.cost
                });

                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error("Error updating expense:", error);
            } finally {
                setUpdatingExpenseIds(prev => prev.filter(id => id !== expenseId));
            }
        },
        [setRefreshTrigger]
    );

    if (isLoading) return <EstimatesSkeletonLoader />;

    if (estimates.length > 0) return (
        <>
        <h1 className="text-3xl flex-1 font-bold">My Custom Estimates</h1>
        <Link href="/estimate">
            <Button aria-label="Create new estimate" variant="destructive" onClick={() => {localStorage.removeItem("catCostBreakdown")}}>
                Create new estimate
            </Button>
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-8 lg:gap-16">
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
                        <CustomExpenseForm onSubmit={(formData) => handleCreateExpense({ 
                                ...formData, 
                                user_estimate_id: estimate[0].user_estimate_id 
                            })}  />
                    </DialogContent>
                </Dialog>
                <Card className="flex-1 w-full shadow-md rounded-xl flex flex-col h-full">
                <CardHeader className="flex justify-between items-center">
                    <div>
                        <CardTitle className="px-3">{estimateNames[index]}</CardTitle>
                        <CardDescription className="px-3">
                            Created {estimateDates[index]}
                            <br />
                            Updated {estimateUpdateDates[index]}
                        </CardDescription>
                    </div>
                    <Button aria-label="Add expense" onClick={() => setActiveEstimateIndex(index)}>Add expense</Button>
                </CardHeader>
                <CardContent className="text-secondary flex-1 flex flex-col justify-between">
                    <table className="w-full text-left table-auto">
                        <tbody>
                        {estimate
                            .map((item, index) => (
                            <tr 
                                key={index}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.effectAllowed = 'move';
                                    setDraggedExpense({ id: item.id, estimateIndex: index, expenseIndex: index });
                                }}
                                onDragEnd={() => {
                                    setDraggedExpense(null);
                                    setDragOverExpense(null);
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (draggedExpense && draggedExpense.id !== item.id) {
                                        setDragOverExpense({ id: item.id, estimateIndex: index, expenseIndex: index });
                                    }
                                }}
                                onDragLeave={() => {
                                    if (dragOverExpense?.id === item.id) {
                                        setDragOverExpense(null);
                                    }
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedExpense && draggedExpense.id !== item.id) {
                                        handleExpenseReorder(draggedExpense.id, item.order);
                                        // Clear the highlight after drop
                                        setDragOverExpense(null);
                                    }
                                }}
                                className={dragOverExpense?.id === item.id ? 'bg-slate-100' : ''}
                            >
                                <td className="w-10 border-b border-slate-200 text-center cursor-move">
                                    <div className="flex justify-center items-center">
                                        <GripHorizontal size={16} className="text-slate-500" />
                                    </div>
                                </td>
                                <td className="p-3 border-b border-slate-200"
                                >
                                    <input
                                        type="text"
                                        aria-label="Expense name"
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
                                        onBlur={() => {
                                            // Get the original values
                                            const originalValues = originalExpenseValues.current.get(item.id);
                                            
                                            // Only update if the value has changed
                                            if (originalValues && originalValues.name !== item.name) {
                                                handleExpenseUpdate(item.id, { 
                                                    name: item.name, 
                                                    cost: item.cost 
                                                });
                                                
                                                // Update the original value after successful update
                                                originalExpenseValues.current.set(item.id, {
                                                    name: item.name,
                                                    cost: item.cost
                                                });
                                            }
                                        }}
                                        className="block w-full text-sm text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="p-3 border-b border-slate-200 w-1/6">
                                    <input
                                        type="number"
                                        value={item.cost}
                                        aria-label="Expense cost"
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
                                        onBlur={() => {
                                            // Get the original values
                                            const originalValues = originalExpenseValues.current.get(item.id);
                                            
                                            // Only update if the value has changed
                                            if (originalValues && originalValues.cost !== item.cost) {
                                                handleExpenseUpdate(item.id, { 
                                                    name: item.name, 
                                                    cost: Number(item.cost) 
                                                });
                                                
                                                // Update the original value after successful update
                                                originalExpenseValues.current.set(item.id, {
                                                    name: item.name,
                                                    cost: item.cost
                                                });
                                            }
                                        }}
                                        className="block w-full text-sm text-end text-slate-800 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-slate-300 rounded px-2 py-1"
                                    />
                                </td>
                                <td className="p-3 border-b border-slate-200 w-10 text-center">
                                    <button 
                                        onClick={() => handleDeleteExpense(item.id)}
                                        className="text-slate-500 hover:text-red-500 transition-colors"
                                        aria-label="Delete expense"
                                        disabled={updatingExpenseIds.includes(item.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className="w-10 border-t border-slate-300"></td>
                            <td className="p-4 text-left font-bold text-slate-800 border-t border-slate-300">
                            Total:
                            </td>
                            <td className="p-4 text-end font-semibold text-slate-800 border-t border-slate-300">
                            {estimate.reduce((acc, item) => acc + item.cost, 0)}$
                            </td>
                            <td className="w-10 border-t border-slate-300"></td>
                        </tr>
                        </tfoot>
                    </table>
                    <Button
                        aria-label="Delete estimate"
                        className="w-full mt-4 bg-red-500 hover:bg-red-600" 
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
                                
                                // Refresh data to get updated timestamps
                                setRefreshTrigger(prev => prev + 1);
                            } catch (error) {
                                console.error('Error deleting custom estimate:', error);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting Estimate...' : 'Delete Estimate'}
                    </Button>
                </CardContent>
                </Card>
            </div>
        ))}
        </div>
        </>
    );

    return (
        <p className="text-muted-foreground font-semibold">No estimates found</p>
    );
}