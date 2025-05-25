import Loading from "@/components/loading";
import { ResultsDisplay } from "@/components/results-display";
import { createClientServer } from "@/utils/supabase/server";
import { CandidateType } from "@/utils/types";
import { Suspense } from "react";

export default async function ResultsPage() {
  const supabase = await createClientServer();

  const { data } = await supabase.from("candidates").select("*");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Voting Results</h1>
        <p className="text-gray-600">View current voting results and statistics</p>
      </div>
      <Suspense fallback={<Loading />}>
        <ResultsDisplay candidates={data as CandidateType[]} />
      </Suspense>
    </div>
  );
}
