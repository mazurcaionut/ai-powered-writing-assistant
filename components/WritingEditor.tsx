"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
    explanation: string;
}

const WritingEditor = () => {
    const [content, setContent] = useState("");
    const [rewrittenContent, setRewrittenContent] = useState("");
    const [explanation, setExplanation] = useState("");
    const [tone, setTone] = useState("formal");
    const [lengthFactor, setLengthFactor] = useState([1.0]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (rewrittenContent && explanation) {
            setRewrittenContent("");
            setExplanation("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    useEffect(() => {
        const fetchStoredHistory = async () => {
            try {
                const storedHistory = localStorage.getItem("history");
                if (storedHistory) {
                    setHistory(JSON.parse(storedHistory));
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchStoredHistory();
    }, []);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    const wordCount = useMemo(
        () =>
            content
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0).length,
        [content]
    );

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setContent(e.target.value);

    const handleDeleteHistoryEntry = (index: number) =>
        setHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));

    const handleRewrite = async () => {
        if (content.trim().length === 0) {
            toast({
                title: "No content to rewrite",
                description: "Please write something first.",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        const formData = new FormData();
        formData.append("content", content);
        formData.append("tone", tone);
        formData.append("length", lengthFactor[0].toString());

        const response = await rewrite(formData);

        setIsProcessing(false);

        if (response.errors) {
            toast({
                title: "Something went wrong",
                description: "There was an error rewriting your text.",
                variant: "destructive",
            });
            return;
        }

        const { explanation, rewrittenContent } = response.data;

        setRewrittenContent(rewrittenContent);
        setExplanation(explanation);

        const newHistoryEntry: HistoryEntry = {
            explanation,
            originalText: content,
            rewrittenText: rewrittenContent,
            tone,
            lengthFactor: lengthFactor[0],
            timestamp: new Date(),
        };
        setHistory((prev) => [newHistoryEntry, ...prev]);

        toast({
            title: "Text Rewritten",
            description: "Your text has been rewritten with AI assistance.",
        });
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-4 animate-fade-in">
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
                    {rewrittenContent && explanation && (
                        <ExplanationDialog
                            originalText={content}
                            rewrittenText={rewrittenContent}
                            explanation={explanation}
                        />
                    )}
                    <Button
                        disabled={isProcessing}
                        className="gap-2"
                        onClick={handleRewrite}
                    >
                        {isProcessing ? (
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
                            {rewrittenContent ? (
                                <div className="whitespace-pre-wrap">
                                    {rewrittenContent}
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
        </div>
    );
};

export default WritingEditor;
