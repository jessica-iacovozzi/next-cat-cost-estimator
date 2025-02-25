import DraftEstimate from "@/components/draft-estimate";
import UserEstimates from "@/components/user-estimates";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Estimates(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 w-full flex">
      <div className="w-full flex flex-wrap justify-between gap-4">
        {searchParams.estimateId && <DraftEstimate estimateId={searchParams.estimateId as string} />}
        {!searchParams.estimateId && <UserEstimates />}
      </div>
    </div>
  );
}
