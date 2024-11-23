"use server";

import { analyze } from "@/utils/ai";

export async function rewrite(formData: FormData) {
    const content = formData.get("content");

    const rewrittenVersion = await analyze(content as string);

    return rewrittenVersion;
}
