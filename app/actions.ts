"use server";

import { analyze } from "@/utils/ai";
import { z } from "zod";

const schema = z.object({
    content: z.string(),
    tone: z.string(),
    length: z.string(),
});

export async function rewrite(formData: FormData) {
    const validatedFields = schema.safeParse({
        content: formData.get("content"),
        tone: formData.get("tone"),
        length: formData.get("length"),
    });

    if (!validatedFields.success) {
        return {
            data: null,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const output = await analyze(validatedFields.data);

    if (output) {
        return { data: { ...validatedFields.data, ...output }, errors: null };
    } else {
        return {
            data: null,
            errors: {
                content: ["Something went wrong"],
            },
        };
    }
}
