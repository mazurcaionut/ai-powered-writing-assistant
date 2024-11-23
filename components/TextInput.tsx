"use client";

import { rewrite } from "@/app/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const TextInput = () => {
    const { pending } = useFormStatus();
    const [content, setContent] = useState("");
    const [rewrittenContent, setRewrittenContent] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const rewrittenVersion = await rewrite(formData);

        setRewrittenContent(rewrittenVersion ?? "");
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <textarea
                className="border border-black p-2"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={pending}
            >
                Rewrite
            </button>
            {rewrittenContent && (
                <>
                    <p>{content}</p>
                    <p>{rewrittenContent}</p>
                </>
            )}
        </form>
    );
};

export default TextInput;
