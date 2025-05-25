"use server";

import { createClientServer } from "@/utils/supabase/server";

export const voteAction = async (selection: Record<string, number>) => {
  // Validate the selection
  if (!selection || Object.keys(selection).length === 0) {
    throw new Error("No selections made");
  }

  try {
    const supabase = await createClientServer();

    // Get candidate with key from selection and its value then update the votes field
    const updates = Object.entries(selection).map(([portfolioId, candidateId]) => ({
      id: candidateId,
      portfolio_id: portfolioId,
    }));
    console.log("Updates to be made:", updates);

    // Process each update
    for (const update of updates) {
      // First, get the current candidate
      const { data: candidate, error: fetchError } = await supabase
        .from("candidates")
        .select()
        .eq("id", update.id)
        .single();

      if (fetchError) {
        console.error(`Error fetching candidate ${update.id}:`, fetchError);
        continue;
      }

      // Now update the votes count
      const { error: updateError } = await supabase
        .from("candidates")
        .update({ votes: (candidate.votes || 0) + 1 })
        .eq("id", update.id);

      if (updateError) {
        console.error(`Error updating votes for candidate ${update.id}:`, updateError);
      }
    }

    return { success: true, message: "Votes updated successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred while updating votes" };
  }
};
