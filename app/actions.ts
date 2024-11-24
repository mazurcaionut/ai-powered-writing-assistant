"use server";

import { analyze } from "@/utils/ai";
import { z } from "zod";

const schema = z.object({
    content: z.string(),
    tone: z.string(),
    length: z.string(),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function rewrite(_: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        content: formData.get("content"),
        tone: formData.get("tone"),
        length: formData.get("length"),
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        console.log("Gets here: ", validatedFields.error.flatten().fieldErrors);
        return {
            data: null,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const output = await analyze(validatedFields.data);

    console.log("Output: ", output);

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
