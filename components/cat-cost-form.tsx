"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfoTooltip from "@/components/ui/info-tooltip";
import { InfoIcon } from "lucide-react";

const catCostSchema = z.object({
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
  const { register, handleSubmit, control, formState: { errors }, } = useForm<CatCostFormValues>({
    resolver: zodResolver(catCostSchema),
    defaultValues: { insurance: false },
  });

  return (
    <Card className="flex-none p-5 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>Quebec Annual Cost of Care Estimator</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Life Stage Selection */}
          <Controller
            name="lifeStage"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <SelectItem value="">Select life stage</SelectItem>
                <SelectItem value="Kitten">Kitten</SelectItem>
                <SelectItem value="Adult">Adult</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </Select>
            )}
          />
          {errors.lifeStage && <p className="text-red-500 text-sm">{errors.lifeStage.message}</p>}

          {/* Sex Selection */}
          <Controller
            name="sex"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <SelectItem value="">Select sex</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </Select>
            )}
          />
          {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}

          {/* Lifestyle Selection */}
          <Controller
            name="lifestyle"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <SelectItem value="">Select lifestyle</SelectItem>
                <SelectItem value="Indoor">Indoor</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
              </Select>
            )}
          />
          {errors.lifestyle && <p className="text-red-500 text-sm">{errors.lifestyle.message}</p>}

          {/* Insurance Selection */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" {...register("insurance")} className="w-5 h-5" />
            <label className="font-medium text-secondary">Add Insurance?</label>
            <InfoTooltip content="Insurance covers unexpected vet bills for accidents, injuries, and illnesses.The AMVQ believes that pet insurance is well worth the cost!">
              <InfoIcon className="w-5 h-5 text-secondary" />
            </InfoTooltip>
          </div>

          {/* Submit Button */}
          <Button aria-label="Calculate Cost" type="submit" variant="destructive" className="w-full">Calculate Cost</Button>
        </form>
      </CardContent>
    </Card>
  );
}
