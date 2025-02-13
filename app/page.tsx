import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center p-10">
        <h1 className="text-3xl font-bold">🐱 Thinking of adopting a cat?</h1>
        <p className="mt-2">Estimate your yearly costs in under 3 minutes.</p>
        <Link href="/estimate" className="mt-5 px-6 py-3 bg-orange-500 text-white rounded-lg">Start Estimating</Link>
      </main>
    </div>
  );
}
