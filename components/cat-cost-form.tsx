"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const catCostSchema = z.object({
  lifeStage: z.enum(["Kitten", "Adult", "Senior"]),
  sex: z.enum(["Male", "Female"]).optional(),
  lifestyle: z.enum(["Indoor", "Outdoor"]),
  insurance: z.boolean(),
});

type CatCostFormValues = z.infer<typeof catCostSchema>;

export default function CatCostForm({ onSubmit }: { onSubmit: (data: CatCostFormValues) => void }) {
  const [lifeStage, setLifeStage] = useState<"Kitten" | "Adult" | "Senior" | null>(null);
  const { register, handleSubmit, control, watch } = useForm<CatCostFormValues>({
    resolver: zodResolver(catCostSchema),
    defaultValues: { insurance: false },
  });

  const selectedLifeStage = watch("lifeStage");

  return (
    <Card className="max-w-md mx-auto mt-8 p-6 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Cat Annual Cost Estimator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Life Stage Selection */}
          <Label className="block font-medium">Life Stage</Label>
          <Controller
            name="lifeStage"
            control={control}
            render={({ field }) => (
              <Select {...field} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value as "Kitten" | "Adult" | "Senior";
                field.onChange(value);
                setLifeStage(value);
              }}>
                <SelectItem value="Kitten">Kitten</SelectItem>
                <SelectItem value="Adult">Adult</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </Select>
            )}
          />

          {/* Sex Selection (Only for Kittens) */}
          <Label className="block font-medium">Sex</Label>
          <Select {...register("sex")}>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </Select>

          {/* Lifestyle Selection */}
          <Label className="block font-medium">Lifestyle</Label>
          <Controller
            name="lifestyle"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <SelectItem value="Indoor">Indoor</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
              </Select>
            )}
          />
          {/* Insurance Selection */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" {...register("insurance")} className="w-5 h-5" />
            <label className="font-medium text-secondary">Add Insurance?</label>
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="secondary" className="w-full">Calculate Cost</Button>
        </form>
      </CardContent>
    </Card>
  );
}
