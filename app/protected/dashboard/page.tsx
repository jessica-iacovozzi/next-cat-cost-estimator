import CustomEstimate from "@/components/custom-estimate";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Dashboard(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 w-full flex">
      <div className="w-full flex gap-4">
        <CustomEstimate estimateId={searchParams.estimateId as string} />
      </div>
    </div>
  );
}
