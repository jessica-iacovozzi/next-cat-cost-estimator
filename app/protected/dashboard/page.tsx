import CustomEstimate from "@/components/custom-estimate";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Dashboard(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="text-3xl text-center font-bold mb-10">My customized estimate</h1>

        <CustomEstimate estimateId={searchParams.estimateId as string} />
      </div>
    </div>
  );
}
