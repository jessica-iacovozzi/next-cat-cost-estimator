"use client";

import { createUserExpense, getUserExpenses, getUserEstimates, deleteEstimate, deleteExpenses, deleteExpense, updateExpense, updateExpenseOrder } from "@/lib/calculateAnnualCosts";
import { useState, useEffect, useCallback, useRef } from "react";
import CustomExpenseForm from "./custom-expense-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, GripHorizontal, Pencil, Check, DollarSign, X } from "lucide-react";
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
    const [editingExpenseIds, setEditingExpenseIds] = useState<number[]>([]);
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
        async (expenseId: number, data?: { name: string, cost: number }) => {
            try {
                setUpdatingExpenseIds(prev => [...prev, expenseId]);
                
                if (data) {
                    await updateExpense(expenseId, data);

                    originalExpenseValues.current.set(expenseId, {
                        name: data.name,
                        cost: data.cost
                    });
                }
                
                setEditingExpenseIds(prev => prev.filter(id => id !== expenseId));
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error("Error updating expense:", error);
            } finally {
                setUpdatingExpenseIds(prev => prev.filter(id => id !== expenseId));
            }
        },
        [setRefreshTrigger]
    );
    
    const toggleEditMode = (expenseId: number) => {
        setEditingExpenseIds(prev => {
            if (prev.includes(expenseId)) {
                return prev.filter(id => id !== expenseId);
            } else {
                return [...prev, expenseId];
            }
        });
    };

    if (isLoading) return <EstimatesSkeletonLoader />;

    if (estimates.length > 0) return (
        <>
        <div className="flex flex-col gap-4 md:flex-row justify-between w-full lg:mx-24">
            <h1 className="text-xl md:text-3xl flex-1 font-bold">My Custom Estimates</h1>
            <Link href="/estimate">
                <Button aria-label="Create new estimate" variant="destructive" onClick={() => {localStorage.removeItem("catCostBreakdown")}}>
                    Create new estimate
                </Button>
            </Link>
        </div>
        <div className="flex flex-col gap-8 lg:gap-16 w-full lg:mx-32">
        {estimates.map((estimate, index) => (
            <div key={index} className="flex">
                <Dialog open={activeEstimateIndex === index} onOpenChange={(open) => {
                    if (!open) {
                        setActiveEstimateIndex(null);
                    }
                }}>
                    <DialogContent aria-describedby="Custom Expense Creation Form">
                        <div className="flex">
                            <DialogTitle>Custom Expense</DialogTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto"
                                onClick={() => setActiveEstimateIndex(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <DialogDescription>Create a custom expense for this estimate.</DialogDescription>
                        <CustomExpenseForm onSubmit={(formData) => handleCreateExpense({ 
                                ...formData, 
                                user_estimate_id: estimate[0].user_estimate_id 
                            })}  />
                    </DialogContent>
                </Dialog>
                <Card className="flex-1 w-full shadow-md rounded-xl flex flex-col h-full">
                <CardHeader className="flex flex-col">
                    <div className="flex items-center mb-2 md:mb-0 md:justify-between">
                        <CardTitle className="px-3 w-2/3 md:w-auto">{estimateNames[index]}</CardTitle>
                        <Button className="w-1/3 md:w-40" aria-label="Add expense" onClick={() => setActiveEstimateIndex(index)}>Add expense</Button>
                    </div>
                        <CardDescription className="px-3">
                            Created {estimateDates[index]}
                            <br />
                            Updated {estimateUpdateDates[index]}
                        </CardDescription>
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
                                <td className="p-3 border-b border-slate-200">
                                    <input
                                        type="text"
                                        aria-label="Expense name"
                                        value={item.name}
                                        readOnly={!editingExpenseIds.includes(item.id)}
                                        tabIndex={!editingExpenseIds.includes(item.id) ? -1 : undefined}
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
                                        className={`block w-full text-sm text-slate-800 ${editingExpenseIds.includes(item.id) ? 'bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300' : 'bg-transparent focus:outline-none'} border-none rounded px-2 py-1 ${!editingExpenseIds.includes(item.id) ? 'cursor-default' : ''}`}
                                    />
                                </td>
                                <td className="p-3 border-b border-slate-200 w-[10%]">
                                    <input
                                        type="number"
                                        value={item.cost}
                                        aria-label="Expense cost"
                                        readOnly={!editingExpenseIds.includes(item.id)}
                                        tabIndex={!editingExpenseIds.includes(item.id) ? -1 : undefined}
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
                                        className={`block w-full text-sm text-end text-slate-800 ${editingExpenseIds.includes(item.id) ? 'bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300' : 'bg-transparent focus:outline-none'} border-none rounded px-2 py-1 ${!editingExpenseIds.includes(item.id) ? 'cursor-default' : ''}`}
                                    />
                                </td>
                                <td className="p-3 border-b border-slate-200 w-10 text-center">
                                    <button 
                                        onClick={() => {
                                            if (editingExpenseIds.includes(item.id)) {
                                                const originalValues = originalExpenseValues.current.get(item.id);
                                                const hasNameChanged = originalValues && originalValues.name !== item.name;
                                                const hasCostChanged = originalValues && originalValues.cost !== item.cost;
                                                
                                                if (hasNameChanged || hasCostChanged) {
                                                    handleExpenseUpdate(item.id, { 
                                                        name: item.name, 
                                                        cost: Number(item.cost) 
                                                    });
                                                } else {
                                                    toggleEditMode(item.id);
                                                }
                                            } else {
                                                toggleEditMode(item.id);
                                            }
                                        }}
                                        className="text-slate-500 hover:text-green-500 transition-colors"
                                        aria-label={editingExpenseIds.includes(item.id) ? "Save expense" : "Edit expense"}
                                        disabled={updatingExpenseIds.includes(item.id)}
                                    >
                                        {editingExpenseIds.includes(item.id) ? <Check size={16} /> : <Pencil size={16} />}                                        
                                    </button>
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
                            <td className="p-4 text-left font-bold text-red-600 border-t border-slate-300">
                            Total:
                            </td>
                            <td className="p-4 text-end font-semibold text-red-600 border-t border-slate-300">
                            {estimate.reduce((acc, item) => acc + item.cost, 0)}$
                            </td>
                            <td className="w-10 border-t border-slate-300"></td>
                        </tr>
                        </tfoot>
                    </table>
                    <Button
                        aria-label="Delete estimate"
                        className="w-full bg-red-500 hover:bg-red-600" 
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                const user_estimate_id = estimate[0]?.user_estimate_id;
                                
                                if (!user_estimate_id) {
                                    console.error('Error: Could not find user_estimate_id');
                                    return;
                                }
                                
                                // Optimistically update UI by removing this estimate from the state
                                setEstimates(prev => prev.filter(est => est[0]?.user_estimate_id !== user_estimate_id));
                                setEstimateNames(prev => {
                                    const newNames = [...prev];
                                    newNames.splice(index, 1);
                                    return newNames;
                                });
                                setEstimateDates(prev => {
                                    const newDates = [...prev];
                                    newDates.splice(index, 1);
                                    return newDates;
                                });
                                setEstimateUpdateDates(prev => {
                                    const newDates = [...prev];
                                    newDates.splice(index, 1);
                                    return newDates;
                                });
                                
                                await deleteExpenses(user_estimate_id);
                                await deleteEstimate(user_estimate_id);
                            } catch (error) {
                                console.error('Error deleting custom estimate:', error);
                                // If there was an error, refresh to get the correct state
                                setRefreshTrigger(prev => prev + 1);
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
        <>
        <div className="flex flex-col gap-4 md:flex-row justify-between w-full lg:mx-24">
            <h1 className="text-xl md:text-3xl flex-1 font-bold">My Custom Estimates</h1>
            <Link href="/estimate">
                <Button aria-label="Create new estimate" variant="destructive" onClick={() => {localStorage.removeItem("catCostBreakdown")}}>
                    Create new estimate
                </Button>
            </Link>
        </div>
        <p className="text-muted-foreground font-semibold">No estimates found</p>
        </>
    );
}