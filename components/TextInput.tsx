"use client";

import { rewrite } from "@/app/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

const TextInput = () => {
    const { pending } = useFormStatus();
    const [content, setContent] = useState("");
    const [tone, setTone] = useState("");
    const [length, setLength] = useState("");
    const [rewrittenContent, setRewrittenContent] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget as HTMLFormElement);
        console.log("Event: ", formData);
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
            <div className="flex gap-5">
                <label>
                    <input
                        type="radio"
                        name="tone"
                        value="formal"
                        checked={tone === "formal"}
                        onChange={(e) => setTone(e.target.value)}
                    />
                    Formal
                </label>
                <label>
                    <input
                        type="radio"
                        name="tone"
                        value="casual"
                        checked={tone === "casual"}
                        onChange={(e) => setTone(e.target.value)}
                    />
                    Casual
                </label>
                <label>
                    <input
                        type="radio"
                        name="tone"
                        value="persuasive"
                        checked={tone === "persuasive"}
                        onChange={(e) => setTone(e.target.value)}
                    />
                    Persuasive
                </label>
            </div>
            <div className="flex gap-5">
                <label>
                    <input
                        type="radio"
                        name="length"
                        value="shorter"
                        checked={length === "shorter"}
                        onChange={(e) => setLength(e.target.value)}
                    />
                    Shorter
                </label>
                <label>
                    <input
                        type="radio"
                        name="length"
                        value="longer"
                        checked={length === "longer"}
                        onChange={(e) => setLength(e.target.value)}
                    />
                    Longer
                </label>
                <label>
                    <input
                        type="radio"
                        name="length"
                        value="concise"
                        checked={length === "concise"}
                        onChange={(e) => setLength(e.target.value)}
                    />
                    Concise
                </label>
            </div>
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
