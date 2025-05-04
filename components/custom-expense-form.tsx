"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OctagonAlert } from "lucide-react";

const customExpenseSchema = z.object({
  name: z.string(),
  cost: z.number()
});

export type CustomExpenseFormValues = z.infer<typeof customExpenseSchema>;

export default function CustomExpenseForm({ onSubmit }: { onSubmit: (data: CustomExpenseFormValues) => void }) {
  const { register, handleSubmit, formState: { errors }, } = useForm<CustomExpenseFormValues>({
    resolver: zodResolver(customExpenseSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label id="expense-name-label" htmlFor="expense-name" className="font-medium text-white">Expense Name</Label>
        <Input 
          id="expense-name"
          type="text" 
          required 
          {...register("name", { required: true })} 
          placeholder="Name" 
          className="w-full p-2 border border-white rounded-lg bg-transparent placeholder:text-white" 
          labelledBy="expense-name-label"
          describedBy={errors.name ? "expense-name-error" : "expense-name-help"}
          aria-invalid={Boolean(errors?.name)}
          aria-required
        />
        <p id="expense-name-help" className="sr-only">Enter the name of the custom expense.</p>
        {errors.name && <p id="expense-name-error" role="alert" className="text-secondary text-sm flex items-center gap-1"><OctagonAlert className="h-4 w-4" />{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label id="expense-cost-label" htmlFor="expense-cost" className="font-medium text-white">Expense Cost</Label>
        <Input 
          id="expense-cost"
          type="number" 
          required 
          {...register("cost", { valueAsNumber: true })} 
          placeholder="Cost" 
          className="w-full p-2 border border-white rounded-lg bg-transparent placeholder:text-white" 
          labelledBy="expense-cost-label"
          describedBy={errors.cost ? "expense-cost-error" : "expense-cost-help"}
          aria-invalid={Boolean(errors?.cost)}
          aria-required
        />
        <p id="expense-cost-help" className="sr-only">Enter the cost of the custom expense in dollars.</p>
        {errors.cost && <p id="expense-cost-error" role="alert" className="text-secondary text-sm flex items-center gap-1"><OctagonAlert className="h-4 w-4" />{errors.cost.message}</p>}
      </div>

      <Button type="submit" className="w-full rounded-lg">Add Expense</Button>
    </form>
  );
}
