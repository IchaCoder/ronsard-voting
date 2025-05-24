"use server";

import { createClientServer } from "@/utils/supabase/server";

export async function uploadFiles(files: File[], bucketName: string): Promise<string[]> {
  const supabase = await createClientServer();
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { publicUrl } = supabase.storage.from(bucketName).getPublicUrl(fileName).data;
    return publicUrl;
  });

  return Promise.all(uploadPromises);
}
