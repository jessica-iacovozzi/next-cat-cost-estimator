'use client';

import CatCostForm from "@/components/cat-cost-form";

export default function Estimate() {
  const handleSubmit = (data: { 
    lifeStage: "Kitten" | "Adult" | "Senior";
    lifestyle: "Indoor" | "Outdoor";
    insurance: boolean;
    sex?: "Male" | "Female" | undefined;
  }) => {
    console.log('Form data:', data);
    // Form submission logic here
  };

  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start">
      <CatCostForm onSubmit={handleSubmit} />
    </div>
  );
}