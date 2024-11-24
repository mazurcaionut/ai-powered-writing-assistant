"use client";

import React, { useState, useEffect, useActionState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditorControls from "./EditorControls";
import ExplanationDialog from "./ExplanationDialog";
import HistorySection from "./HistorySection";
import { rewrite } from "@/app/actions";

interface HistoryEntry {
    originalText: string;
    rewrittenText: string;
    tone: string;
    lengthFactor: number;
    timestamp: Date;
}

const WritingEditor = () => {
    const [state, action, isPending] = useActionState(rewrite, null);
    const [content, setContent] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [tone, setTone] = useState("neutral");
    const [lengthFactor, setLengthFactor] = useState([1.0]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    // const { toast } = useToast();

    useEffect(() => {
        const fetchStoredHistory = async () => {
            // setLoading(true);
            try {
                const storedHistory = localStorage.getItem("history");
                if (storedHistory) {
                    setHistory(JSON.parse(storedHistory));
                }
            } catch (error) {
                console.error(error);
            } finally {
                // setLoading(false);
            }
        };
        fetchStoredHistory();
    }, []);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        if (state && state.data && !state.errors) {
            setHistory((prevHistory) => [
                ...prevHistory,
                {
                    originalText: state.data.content,
                    rewrittenText: state.data.rewrittenContent,
                    tone: state.data.tone,
                    lengthFactor: state.data.length as unknown as number,
                    timestamp: new Date(),
                },
            ]);
        }
    }, [state]);

    useEffect(() => {
        const words = content
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
        setWordCount(words.length);
    }, [content]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        console.log("Content updated:", e.target.value);
    };

    const handleDeleteHistoryEntry = (index: number) => {
        console.log("Deleting history entry at index:", index);
        setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
    };

    // const handleRewrite = async () => {
    //     if (content.trim().length === 0) {
    //         toast({
    //             title: "No content to rewrite",
    //             description: "Please write something first.",
    //             variant: "destructive",
    //         });
    //         return;
    //     }

    //     setIsProcessing(true);
    //     console.log(
    //         "Requesting rewrite with tone:",
    //         tone,
    //         "length factor:",
    //         lengthFactor[0]
    //     );

    //     // Simulate AI processing
    //     setTimeout(() => {
    //         let mockRewrite = content
    //             .split(".")
    //             .map((sentence) => sentence.trim())
    //             .filter((sentence) => sentence.length > 0)
    //             .map((sentence) => {
    //                 let modifiedSentence = sentence;
    //                 switch (tone) {
    //                     case "formal":
    //                         modifiedSentence = `Indeed, ${sentence}`;
    //                         break;
    //                     case "casual":
    //                         modifiedSentence = `Hey, ${sentence}`;
    //                         break;
    //                     case "professional":
    //                         modifiedSentence = `Furthermore, ${sentence}`;
    //                         break;
    //                     default:
    //                         break;
    //                 }
    //                 return `${modifiedSentence}. `;
    //             })
    //             .join("\n\n");

    //         if (lengthFactor[0] < 1) {
    //             mockRewrite = mockRewrite
    //                 .split("\n\n")
    //                 .slice(
    //                     0,
    //                     Math.ceil(
    //                         mockRewrite.split("\n\n").length * lengthFactor[0]
    //                     )
    //                 )
    //                 .join("\n\n");
    //         } else if (lengthFactor[0] > 1) {
    //             const extraSentences = Array(
    //                 Math.ceil((lengthFactor[0] - 1) * 2)
    //             ).fill("Additionally, this expands upon the previous point.");
    //             mockRewrite += "\n\n" + extraSentences.join("\n\n");
    //         }

    //         setRewrittenContent(mockRewrite);
    //         setIsProcessing(false);

    //         const newHistoryEntry: HistoryEntry = {
    //             originalText: content,
    //             rewrittenText: mockRewrite,
    //             tone,
    //             lengthFactor: lengthFactor[0],
    //             timestamp: new Date(),
    //         };
    //         setHistory((prev) => [newHistoryEntry, ...prev]);

    //         toast({
    //             title: "Text Rewritten",
    //             description: "Your text has been rewritten with AI assistance.",
    //         });
    //     }, 1500);
    // };

    return (
        <form
            className="w-full max-w-6xl mx-auto space-y-4 animate-fade-in"
            action={action}
        >
            <div className="px-2 md:px-0">
                <EditorControls
                    tone={tone}
                    setTone={setTone}
                    lengthFactor={lengthFactor}
                    setLengthFactor={setLengthFactor}
                />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-2 md:px-0 gap-2">
                <div className="text-sm text-gray-500 w-full md:w-auto">
                    {wordCount} {wordCount === 1 ? "word" : "words"}
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                    {state?.data?.rewrittenContent && (
                        <ExplanationDialog
                            originalText={content}
                            rewrittenText={state.data.rewrittenContent}
                            tone={tone}
                            lengthFactor={lengthFactor[0]}
                        />
                    )}
                    <Button
                        disabled={isPending}
                        className="gap-2"
                        type="submit"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                        Rewrite
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 px-2 md:px-0">
                        Original Text
                    </label>
                    <ScrollArea className="h-[300px] md:h-[500px] w-full rounded-md border">
                        <textarea
                            name="content"
                            className="w-full h-full p-4 text-base md:text-lg leading-relaxed border-none outline-none resize-none bg-transparent"
                            placeholder="Start writing something amazing..."
                            value={content}
                            onChange={handleContentChange}
                        />
                    </ScrollArea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 px-2 md:px-0">
                        Rewritten Text
                    </label>
                    <ScrollArea className="h-[300px] md:h-[500px] w-full rounded-md border">
                        <div className="p-4 text-base md:text-lg leading-relaxed">
                            {state?.data?.rewrittenContent ? (
                                <div className="whitespace-pre-wrap">
                                    {state?.data.rewrittenContent}
                                </div>
                            ) : (
                                <div className="text-gray-400 italic">
                                    Rewritten text will appear here after
                                    clicking the rewrite button.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <HistorySection
                history={history}
                onDeleteEntry={handleDeleteHistoryEntry}
            />
        </form>
    );
};

export default WritingEditor;
