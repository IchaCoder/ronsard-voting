"use server";

import { CandidatesFormData } from "@/components/candidate-management";
import { createClientServer } from "@/utils/supabase/server";
import { uploadFiles } from "../upload";
import { CandidateType } from "@/utils/types";

export type ResponseType = {
  message: string;
  success: boolean;
};

export async function AddCandidate(candidateData: CandidatesFormData["candidates"]): Promise<ResponseType> {
  let images: File[] = [];
  let formatedCandidateData: CandidateType[] = [];

  candidateData.map((candidate) => {
    if (candidate.image) {
      images.push(candidate.image);
    }
  });

  const uploadedImages = await uploadFiles(images, process.env.NEXT_PUBLIC_SUPABASE_THUMBNAIL_BUCKET!);

  candidateData.map((candidate, index) => {
    const imageUrl = uploadedImages[index] || "";
    formatedCandidateData.push({
      first_name: candidate.firstName,
      middle_name: candidate.middleName || "",
      last_name: candidate.lastName,
      portfolio: candidate.portfolio,
      image: imageUrl,
      // created_at: new Date().toISOString(),
    });
  });

  const supabase = await createClientServer();

  const { data, error } = await supabase.from("candidates").insert(formatedCandidateData);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Candidate added successfully" };
}
