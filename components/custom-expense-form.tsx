"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <Input type="text" required {...register("name", { required: true })} placeholder="Name" className="w-full p-2 border border-white rounded-lg bg-transparent placeholder:text-white" />
      {errors.name && <p className="text-secondary text-sm flex items-center gap-1"><OctagonAlert className="h-4 w-4" />{errors.name.message}</p>}

      <Input type="number" required {...register("cost", { valueAsNumber: true })} placeholder="Cost" className="w-full p-2 border border-white rounded-lg bg-transparent placeholder:text-white" />
      {errors.cost && <p className="text-secondary text-sm flex items-center gap-1"><OctagonAlert className="h-4 w-4" />{errors.cost.message}</p>}

      <Button aria-label="Add Expense" type="submit" className="w-full rounded-lg">Add Expense</Button>
    </form>
  );
}
