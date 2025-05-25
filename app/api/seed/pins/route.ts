import { NextResponse } from "next/server";
import { PINS } from "@/components/data";
import { createClientServer } from "@/utils/supabase/server";
import { UserType } from "@/utils/types";

export async function GET() {
  try {
    const supabase = await createClientServer();

    // Create a counter for successful and failed inserts
    let successCount = 0;
    let failCount = 0;

    // Process each PIN
    for (const pin of PINS) {
      // Check if PIN already exists to avoid duplicates
      const { data: existing, error: checkError } = await supabase.from("users").select("pin").eq("pin", pin).single();

      if (checkError && checkError.code !== "PGRST116") {
        // An error occurred other than "no rows returned"
        console.error(`Error checking PIN ${pin}:`, checkError);
        failCount++;
        continue;
      }

      // If PIN doesn't exist, insert it
      if (!existing) {
        let data: UserType = {
          pin,
          has_voted: false,
        };
        const { error: insertError } = await supabase.from("users").insert(data);

        if (insertError) {
          console.error(`Error inserting PIN ${pin}:`, insertError);
          failCount++;
        } else {
          successCount++;
        }
      } else {
        console.log(`PIN ${pin} already exists, skipped`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Completed seeding PINs. Added: ${successCount}, Failed: ${failCount}, Total: ${PINS.length}`,
    });
  } catch (error) {
    console.error("Error seeding PINs:", error);
    return NextResponse.json({ success: false, message: "Failed to seed PINs", error: String(error) }, { status: 500 });
  }
}
