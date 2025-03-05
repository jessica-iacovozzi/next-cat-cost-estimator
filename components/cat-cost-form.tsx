"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoTooltip from "@/components/ui/info-tooltip";
import { InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormSkeletonLoader } from "@/components/ui/skeleton";

const catCostSchema = z.object({
  name: z.string(),
  lifeStage: z.enum(["Kitten", "Adult", "Senior"], {
    errorMap: () => ({ message: "Please select a life stage." }),
  }),
  sex: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a sex." }),
  }),
  lifestyle: z.enum(["Indoor", "Outdoor"], {
    errorMap: () => ({ message: "Please select a lifestyle." }),
  }),
  insurance: z.boolean(),
});

export type CatCostFormValues = z.infer<typeof catCostSchema>;

export default function CatCostForm({ onSubmit }: { onSubmit: (data: CatCostFormValues) => void }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { register, handleSubmit, control, formState: { errors }, } = useForm<CatCostFormValues>({
    resolver: zodResolver(catCostSchema),
    defaultValues: { name: "", insurance: false, lifeStage: "Kitten", sex: "Male", lifestyle: "Indoor" },
  });

  if (!isClient) {
    return <FormSkeletonLoader />;
  }

  return (
    <Card className="flex-none p-5 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Quebec Annual Cost of Care Estimator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Selection */}
          <div className="space-y-2">
            <label htmlFor="name" className="font-medium text-secondary">Name of Cat</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} id="name" aria-describedby="name-error" title="Name" />
              )}
            />
            {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Life Stage Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <label htmlFor="lifeStage" className="font-medium text-secondary">Life Stage</label>
              <InfoTooltip content={{ text: "Kitten (0-1 year), Adult (1-7 years), Senior (8+ years). Different life stages have different care requirements and costs." }}>
                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
              </InfoTooltip>
            </div>
            <Controller
              name="lifeStage"
              control={control}
              render={({ field }) => (
                <Select {...field} id="lifeStage" aria-describedby="lifeStage-error" title="Life Stage">
                  <SelectItem value="Kitten">Kitten</SelectItem>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </Select>
              )}
            />
            {errors.lifeStage && <p id="lifeStage-error" className="text-red-500 text-sm">{errors.lifeStage.message}</p>}
          </div>

          {/* Sex Selection */}
          <div className="space-y-2">
            <label htmlFor="sex" className="font-medium text-secondary">Sex</label>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Select {...field} id="sex" aria-describedby="sex-error" title="Sex">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </Select>
              )}
            />
            {errors.sex && <p id="sex-error" className="text-red-500 text-sm">{errors.sex.message}</p>}
          </div>

          {/* Lifestyle Selection */}
          <div className="space-y-2">
            <label htmlFor="lifestyle" className="font-medium text-secondary">Lifestyle</label>
            <Controller
              name="lifestyle"
              control={control}
              render={({ field }) => (
                <Select {...field} id="lifestyle" aria-describedby="lifestyle-error" title="Lifestyle">
                  <SelectItem value="Indoor">Indoor</SelectItem>
                  <SelectItem value="Outdoor">Outdoor</SelectItem>
                </Select>
              )}
            />
            {errors.lifestyle && <p id="lifestyle-error" className="text-red-500 text-sm">{errors.lifestyle.message}</p>}
          </div>

          {/* Insurance Selection */}
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="insurance"
              {...register("insurance")} 
              className="w-5 h-5" 
            />
            <label htmlFor="insurance" className="font-medium text-secondary">Add Insurance?</label>
            <InfoTooltip content={{ text: "Insurance covers unexpected vet bills for accidents, injuries, and illnesses. The AMVQ believes that pet insurance is well worth the cost!" }}>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </InfoTooltip>
          </div>

          {/* Submit Button */}
          <Button aria-label="Calculate Cost" type="submit" variant="destructive" className="w-full">Calculate Cost</Button>
        </form>
      </CardContent>
    </Card>
  );
}
