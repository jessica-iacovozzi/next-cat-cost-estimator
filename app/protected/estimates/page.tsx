import DraftEstimate from "@/components/draft-estimate";
import UserEstimates from "@/components/user-estimates";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Estimates(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full">
        {searchParams.estimateId && 
          <div className="flex justify-center w-full lg:w-1/2 mx-auto">
            <DraftEstimate estimateId={searchParams.estimateId as string} estimateName={searchParams.estimateName as string} />
          </div>
        }
        {!searchParams.estimateId && 
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 h-full">
          <UserEstimates />
        </div>
        }
    </div>
  );
}
