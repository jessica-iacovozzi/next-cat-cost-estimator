import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center p-10">
        <h1 className="text-3xl font-bold">🐱 Thinking of getting a cat in Quebec?</h1>
        <p className="mt-2 mb-6">Estimate your yearly costs in under 1 minute.</p>
        <Link href="/estimate">
          <Button variant="orange">Start Estimating</Button>
        </Link>
      </main>
    </div>
  );
}
