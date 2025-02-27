"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center p-10">
        <h1 className="text-3xl font-bold">🐱 Thinking of getting a cat in Quebec?</h1>
        <p className="mt-2 mb-6">Estimate your yearly costs in under 1 minute.</p>
        <Link href="/estimate">
          <Button aria-label="Start Estimating" variant="destructive" onClick={() => {localStorage.removeItem("catCostBreakdown")}}>Start Estimating</Button>
        </Link>
      </main>
    </div>
  );
}
