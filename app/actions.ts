"use server";

import { analyze } from "@/utils/ai";

export async function rewrite(formData: FormData) {
    const rawFormData = {
        content: formData.get("content") as string,
        tone: formData.get("tone") as string,
        length: formData.get("length") as string,
    };

    const rewrittenVersion = await analyze(rawFormData);

    return rewrittenVersion;
}
