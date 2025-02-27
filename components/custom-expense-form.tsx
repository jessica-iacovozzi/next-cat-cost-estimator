"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <Card className="flex-none p-5 shadow-lg rounded-xl">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input type="text" {...register("name")} placeholder="Name" className="w-full p-2 border rounded-lg" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input type="number" {...register("cost", { valueAsNumber: true })} placeholder="Cost" className="w-full p-2 border rounded-lg" />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}

          <Button type="submit" variant="secondary" className="w-full rounded-lg">Add Expense</Button>
        </form>
      </CardContent>
    </Card>
  );
}
