import Loading from "@/components/loading";
import { VotingInterface } from "@/components/voting-interface";
import { createClientServer } from "@/utils/supabase/server";
import { CandidateType } from "@/utils/types";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function VotePage() {
  const supabase = await createClientServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const { data: candidatesData, error: candidatesError } = await supabase.from("candidates").select("*");

  if (!user) {
    redirect("/login");
  }

  if (user?.user_metadata?.isDefaultPasswordChanged !== true) {
    redirect("/change-password");
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Ecole Ronsard Logo"
                width={40}
                height={24}
                className="object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Ecole Ronsard</h1>
                <p className="text-xs text-gray-600">Student Voting Portal</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">Welcome</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cast Your Vote</h1>
          <p className="text-gray-600 mt-2">
            Select your preferred candidate for each portfolio. You can only vote once.
          </p>
        </div>
        <Suspense fallback={<Loading />}>
          <VotingInterface user={user} candidates={candidatesData as CandidateType[]} />
        </Suspense>
      </main>
    </div>
  );
}
