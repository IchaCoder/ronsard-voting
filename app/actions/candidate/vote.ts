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

    // Process each update
    for (const update of updates) {
      // @ts-expect-error
      if (update?.id?.vote === "yes") {
        // fetch for single candidate with portfolio equals update.portfolio_id
        const { data: candidate, error: fetchErrorr } = await supabase
          .from("candidates")
          .select()
          // @ts-expect-error
          .eq("id", update.id?.id)
          .single();
        if (fetchErrorr) {
          console.error(`Error fetching candidate for portfolio ${update.portfolio_id}:`, fetchErrorr);
          continue;
        }
        // // Now update the votes count
        const { error: updateError } = await supabase
          .from("candidates")
          .update({ yes_votes: (candidate.yes_votes || 0) + 1 })
          // @ts-expect-error
          .eq("id", update.id?.id);

        if (updateError) {
          console.error(`Error updating votes for candidate ${update.id}:`, updateError);
        }
        // @ts-expect-error
      } else if (update?.id?.vote === "no") {
        // fetch for single candidate with portfolio equals update.portfolio_id
        const { data: candidate, error: fetchErrorr } = await supabase
          .from("candidates")
          .select()
          // @ts-expect-error
          .eq("id", update.id?.id)
          .single();
        if (fetchErrorr) {
          console.error(`Error fetching candidate for portfolio ${update.portfolio_id}:`, fetchErrorr);
          continue;
        }
        // Now update the votes count
        const { error: updateError } = await supabase
          .from("candidates")
          .update({ no_votes: (candidate.no_votes || 0) + 1 })
          // @ts-expect-error
          .eq("id", update.id?.id);
        if (updateError) {
          console.error(`Error updating votes for candidate ${update.id}:`, updateError);
        }
      } else {
        // Update the votes for the selected candidate
        const { data: candidate, error: fetchError } = await supabase
          .from("candidates")
          .select()
          .eq("id", update.id)
          .single();

        const { error: updateError } = await supabase
          .from("candidates")
          .update({ votes: (candidate.votes || 0) + 1 })
          .eq("id", update.id);

        if (updateError) {
          console.error(`Error fetching candidate ${update.id}:`, fetchError);
          continue;
        }
      }
    }
    return { success: true, message: "Votes updated successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred while updating votes" };
  }
};
