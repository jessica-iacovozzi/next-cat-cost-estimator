"use client";

import { useEffect, useState, useRef } from "react";
import { type AnnualExpenseBreakdown, createUserExpenses, deleteEstimate } from "@/lib/calculateAnnualCosts";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import CustomExpenseForm from "./custom-expense-form";
import { useRouter } from "next/navigation";
import { Trash2, Info as InfoIcon, GripHorizontal, Pencil, Check } from "lucide-react";
import { useToast } from "./ui/toast-context";
import { Spinner } from "./ui/spinner";
import InfoTooltip from "./ui/info-tooltip";

interface DraftEstimateProps {
    estimateId: string;
    estimateName: string;
}

export default function DraftEstimate({ estimateId, estimateName }: DraftEstimateProps) {
    const [breakdown, setBreakdown] = useState<AnnualExpenseBreakdown[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editingExpenseIndices, setEditingExpenseIndices] = useState<number[]>([]);
    const [draggedExpense, setDraggedExpense] = useState<{ index: number } | null>(null);
    const [dragOverExpense, setDragOverExpense] = useState<{ index: number } | null>(null);
    
    const originalExpenseValues = useRef<Map<number, { name: string, cost: number }>>(new Map());
    
    const router = useRouter();
    const { addToast } = useToast();
    
    useEffect(() => {
        setIsLoading(true);
        const storedData = localStorage.getItem("catCostBreakdown");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setBreakdown(parsedData);
          
          // Store original values for comparison later
          originalExpenseValues.current.clear();
          parsedData.forEach((expense: AnnualExpenseBreakdown, index: number) => {
            originalExpenseValues.current.set(index, {
              name: expense.name,
              cost: expense.cost
            });
          });
          
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
            const newBreakdown = [...breakdown, data];
            setBreakdown(newBreakdown);
            
            // Store the original value for the new expense
            const newIndex = newBreakdown.length - 1;
            originalExpenseValues.current.set(newIndex, {
                name: data.name,
                cost: data.cost
            });
            
            localStorage.setItem('catCostBreakdown', JSON.stringify(newBreakdown));
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
        
        // Update original values map
        originalExpenseValues.current.delete(index);
        
        // Reindex the map for remaining expenses
        const newOriginalValues = new Map<number, { name: string, cost: number }>();
        newBreakdown.forEach((expense, idx) => {
            const oldValue = originalExpenseValues.current.get(idx < index ? idx : idx + 1);
            if (oldValue) {
                newOriginalValues.set(idx, oldValue);
            }
        });
        originalExpenseValues.current = newOriginalValues;
        
        localStorage.setItem('catCostBreakdown', JSON.stringify(newBreakdown));
    };
    
    const toggleEditMode = (index: number) => {
        setEditingExpenseIndices(prev => {
            if (prev.includes(index)) {
                return prev.filter(idx => idx !== index);
            } else {
                return [...prev, index];
            }
        });
    };
    
    const handleExpenseReorder = (draggedIndex: number, targetIndex: number) => {
        if (draggedIndex === targetIndex) return;
        
        const newBreakdown = [...breakdown];
        const draggedItem = newBreakdown[draggedIndex];
        
        // Remove the dragged item
        newBreakdown.splice(draggedIndex, 1);
        
        // Insert it at the target position
        newBreakdown.splice(targetIndex, 0, draggedItem);
        
        // Update state
        setBreakdown(newBreakdown);
        localStorage.setItem('catCostBreakdown', JSON.stringify(newBreakdown));
        
        // Update original values map to match new indices
        const newOriginalValues = new Map<number, { name: string, cost: number }>();
        newBreakdown.forEach((expense, idx) => {
            let sourceIdx;
            if (draggedIndex < targetIndex) {
                if (idx < draggedIndex || idx > targetIndex) sourceIdx = idx;
                else if (idx === targetIndex) sourceIdx = draggedIndex;
                else sourceIdx = idx - 1;
            } else {
                if (idx < targetIndex || idx > draggedIndex) sourceIdx = idx;
                else if (idx === targetIndex) sourceIdx = draggedIndex;
                else sourceIdx = idx + 1;
            }
            
            const oldValue = originalExpenseValues.current.get(sourceIdx);
            if (oldValue) {
                newOriginalValues.set(idx, oldValue);
            }
        });
        originalExpenseValues.current = newOriginalValues;
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[200px]">
            <Spinner size={32} text="Loading your draft estimate..." />
        </div>
    );

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
            <Button aria-label="Add expense" onClick={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)}>Add expense</Button>
          </CardHeader>
          <CardContent className="text-secondary">
            <table className="w-full text-left table-auto">
                <tbody>
                {breakdown
                    .map((item, index) => (
                    <tr 
                        key={index}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggedExpense({ index });
                        }}
                        onDragEnd={() => {
                            setDraggedExpense(null);
                            setDragOverExpense(null);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedExpense && draggedExpense.index !== index) {
                                setDragOverExpense({ index });
                            }
                        }}
                        onDragLeave={() => {
                            if (dragOverExpense?.index === index) {
                                setDragOverExpense(null);
                            }
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (draggedExpense && draggedExpense.index !== index) {
                                handleExpenseReorder(draggedExpense.index, index);
                                setDragOverExpense(null);
                            }
                        }}
                        className={dragOverExpense?.index === index ? 'bg-slate-100' : ''}
                    >
                        <td className="w-10 border-b border-slate-200 text-center cursor-move">
                            <div className="flex justify-center items-center">
                                <GripHorizontal size={16} className="text-slate-500" />
                            </div>
                        </td>
                        <td className="p-3 border-b border-slate-200">
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={item.name}
                                    readOnly={!editingExpenseIndices.includes(index)}
                                    tabIndex={!editingExpenseIndices.includes(index) ? -1 : undefined}
                                    onChange={(e) => {
                                        const newBreakdown = [...breakdown];
                                        newBreakdown[index].name = e.target.value;
                                        setBreakdown(newBreakdown);
                                    }}
                                    className={`block w-full text-sm text-slate-800 ${editingExpenseIndices.includes(index) ? 'bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300' : 'bg-transparent focus:outline-none'} border-none rounded px-2 py-1 ${!editingExpenseIndices.includes(index) ? 'cursor-default' : ''}`}
                                />
                                {item.tooltip && item.tooltip.length > 0 && (
                                    <InfoTooltip content={item.tooltip}>
                                        <InfoIcon className="h-4 w-4 text-slate-500" />
                                    </InfoTooltip>
                                )}
                            </div>
                        </td>
                        <td className="p-3 border-b border-slate-200 w-[10%]">
                            <input
                                type="number"
                                value={item.cost}
                                readOnly={!editingExpenseIndices.includes(index)}
                                tabIndex={!editingExpenseIndices.includes(index) ? -1 : undefined}
                                onChange={(e) => {
                                    const newBreakdown = [...breakdown];
                                    newBreakdown[index].cost = Number(e.target.value);
                                    setBreakdown(newBreakdown);
                                }}
                                className={`block w-full text-sm text-end text-slate-800 ${editingExpenseIndices.includes(index) ? 'bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300' : 'bg-transparent focus:outline-none'} border-none rounded px-2 py-1 ${!editingExpenseIndices.includes(index) ? 'cursor-default' : ''}`}
                            />
                        </td>
                        <td className="p-3 border-b border-slate-200 w-10 text-center">
                            <button 
                                onClick={() => {
                                    if (editingExpenseIndices.includes(index)) {
                                        // Save changes
                                        const originalValues = originalExpenseValues.current.get(index);
                                        const hasNameChanged = originalValues && originalValues.name !== item.name;
                                        const hasCostChanged = originalValues && originalValues.cost !== item.cost;
                                        
                                        if (hasNameChanged || hasCostChanged) {
                                            // Update original values
                                            originalExpenseValues.current.set(index, {
                                                name: item.name,
                                                cost: item.cost
                                            });
                                            
                                            // Save to localStorage
                                            localStorage.setItem('catCostBreakdown', JSON.stringify(breakdown));
                                        }
                                        
                                        // Exit edit mode
                                        toggleEditMode(index);
                                    } else {
                                        // Enter edit mode
                                        toggleEditMode(index);
                                    }
                                }}
                                className="text-slate-500 hover:text-green-500 transition-colors"
                                aria-label={editingExpenseIndices.includes(index) ? "Save expense" : "Edit expense"}
                            >
                                {editingExpenseIndices.includes(index) ? <Check size={16} /> : <Pencil size={16} />}
                            </button>
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
                    <td className="w-10 border-t border-slate-300"></td>
                    <td className="p-4 text-left font-bold text-red-600 border-t border-slate-300">
                    Total:
                    </td>
                    <td className="p-4 text-end font-semibold text-red-600 border-t border-slate-300">
                    {breakdown.reduce((acc, item) => acc + item.cost, 0)}$
                    </td>
                    <td className="w-10 border-t border-slate-300"></td>
                    <td className="w-10 border-t border-slate-300"></td>
                </tr>
                </tfoot>
            </table>
            <Button
                aria-label="Save draft estimate"
                className="w-full mt-4" 
                variant="destructive"
                onClick={async () => {
                setIsLoading(true);
                try {
                    await createUserExpenses(breakdown, parseInt(estimateId));
                    addToast({
                      title: "Success",
                      description: "Estimate saved successfully! Redirecting to saved estimates...",
                      variant: "success",
                      duration: 2500,
                      position: "center"
                    });
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                      router.push('/protected/estimates');
                    }, 2500);
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
                aria-label="Delete draft estimate"
                className="w-full mt-4"
                variant="default"
                onClick={async () => {
                setIsLoading(true);
                try {
                    await deleteEstimate(parseInt(estimateId));
                    addToast({
                      title: "Success",
                      description: "Estimate deleted successfully! Redirecting to saved estimates...",
                      variant: "success",
                      duration: 2500,
                      position: "center"
                    });
                    
                    // Redirect after a short delay
                    setTimeout(() => {
                      router.push('/protected/estimates');
                    }, 2500);
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