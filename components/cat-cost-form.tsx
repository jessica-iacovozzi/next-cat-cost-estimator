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
import { Label } from "@/components/ui/label";

const catCostSchema = z.object({
  name: z.string(),
  lifeStage: z.enum(["Kitten", "Adult", "Senior"], {
    errorMap: () => ({ message: "Please select a life stage." }),
  }),
  sex: z.enum(["Male", "Male Neutered", "Female", "Female Spayed"], {
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
            <Label id="name-label" htmlFor="name" className="font-medium text-secondary">Name of Cat</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} id="name" labelledBy="name-label" describedBy={`${errors.name ? " name-error" : "name-help"}`} aria-invalid={errors.name ? "true" : "false"} aria-label="Name of Cat" title="Name" placeholder="Bella" className="placeholder:text-muted-foreground" />
              )}
            />
            {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name.message}</p>}
            <p id="name-help" className="sr-only">Enter the name of your cat.</p>
          </div>

          {/* Life Stage Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label id="lifeStage-label" htmlFor="lifeStage" className="font-medium text-secondary">Life Stage</Label>
              <InfoTooltip content={{ text: "Kitten (0-1 year), Adult (1-7 years), Senior (8+ years). Different life stages have different care requirements and costs." }}>
                <InfoIcon size={16} className="text-muted-foreground cursor-help" />
              </InfoTooltip>
            </div>
            <Controller
              name="lifeStage"
              control={control}
              render={({ field }) => (
                <Select {...field} id="lifeStage" labelledBy="lifeStage-label" describedBy={`${errors.lifeStage ? " lifeStage-error" : "lifeStage-help"}`} aria-invalid={errors.lifeStage ? "true" : "false"} aria-label="Life Stage" title="Life Stage">
                  <SelectItem value="Kitten" aria-label="Kitten">Kitten</SelectItem>
                  <SelectItem value="Adult" aria-label="Adult">Adult</SelectItem>
                  <SelectItem value="Senior" aria-label="Senior">Senior</SelectItem>
                </Select>
              )}
            />
            {errors.lifeStage && <p id="lifeStage-error" className="text-red-500 text-sm">{errors.lifeStage.message}</p>}
            <p id="lifeStage-help" className="sr-only">Select the life stage of your cat.</p>
          </div>

          {/* Sex Selection */}
          <div className="space-y-2">
            <Label id="sex-label" htmlFor="sex" className="font-medium text-secondary">Sex</Label>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Select {...field} id="sex" labelledBy="sex-label" describedBy={`${errors.sex ? " sex-error" : "sex-help"}`} aria-invalid={errors.sex ? "true" : "false"} aria-label="Sex" title="Sex">
                  <SelectItem value="Male" aria-label="Male">Male</SelectItem>
                  <SelectItem value="Male Neutered" aria-label="Male (Neutered)">Male (Neutered)</SelectItem>
                  <SelectItem value="Female" aria-label="Female">Female</SelectItem>
                  <SelectItem value="Female Spayed" aria-label="Female (Spayed)">Female (Spayed)</SelectItem>
                </Select>
              )}
            />
            {errors.sex && <p id="sex-error" className="text-red-500 text-sm">{errors.sex.message}</p>}
            <p id="sex-help" className="sr-only">Select the sex of your cat.</p>
          </div>

          {/* Lifestyle Selection */}
          <div className="space-y-2">
            <Label id="lifestyle-label" htmlFor="lifestyle" className="font-medium text-secondary">Lifestyle</Label>
            <Controller
              name="lifestyle"
              control={control}
              render={({ field }) => (
                <Select {...field} id="lifestyle" labelledBy="lifestyle-label" describedBy={`${errors.lifestyle ? " lifestyle-error" : "lifestyle-help"}`} aria-invalid={errors.lifestyle ? "true" : "false"} aria-label="Lifestyle" title="Lifestyle">
                  <SelectItem value="Indoor" aria-label="Indoor">Indoor</SelectItem>
                  <SelectItem value="Outdoor" aria-label="Outdoor">Outdoor</SelectItem>
                </Select>
              )}
            />
            {errors.lifestyle && <p id="lifestyle-error" className="text-red-500 text-sm">{errors.lifestyle.message}</p>}
            <p id="lifestyle-help" className="sr-only">Select whether your cat lives indoors or outdoors.</p>
          </div>

          {/* Insurance Selection */}
          <div className="flex items-center space-x-2">
            <Input 
              type="checkbox" 
              id="insurance"
              {...register("insurance")} 
              className="w-5 h-5" 
              labelledBy="insurance-label"
              describedBy={`${errors.insurance ? " insurance-error" : "insurance-help"}`}
              aria-invalid={errors.insurance ? "true" : "false"}
              aria-label="Add Insurance (checkbox)"
            />
            <p id="insurance-help" className="sr-only">Add insurance to cover unexpected vet bills for accidents, injuries, and illnesses.</p>
            <Label id="insurance-label" htmlFor="insurance" className="font-medium text-secondary">Add Insurance?</Label>
            <InfoTooltip content={{ text: "Insurance covers unexpected vet bills for accidents, injuries, and illnesses. The AMVQ believes that pet insurance is well worth the cost!" }}>
              <InfoIcon size={16} className="text-muted-foreground cursor-help" />
            </InfoTooltip>
          </div>

          {/* Submit Button */}
          <Button aria-label="Calculate Cost" type="submit" variant="destructive" className="w-full">Calculate Cost</Button>
        </form>
      </CardContent>
    </Card>
  );
}
