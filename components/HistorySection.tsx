"use client";

import React from "react";
import { Clock, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";

interface HistoryEntry {
    originalText: string;
    rewrittenText: string;
    tone: string;
    lengthFactor: number;
    timestamp: Date;
}

interface HistorySectionProps {
    history: HistoryEntry[];
    onDeleteEntry: (index: number) => void;
}

const HistorySection = ({ history, onDeleteEntry }: HistorySectionProps) => {
    const { toast } = useToast();

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const handleDownload = () => {
        console.log("Generating history download...");
        let content = "Writing History\n\n";

        history.forEach((entry, index) => {
            content += `Entry ${index + 1} - ${formatDate(entry.timestamp)}\n`;
            content += `Tone: ${entry.tone}, Length Factor: ${entry.lengthFactor}x\n\n`;
            content += "Original Text:\n";
            content += `${entry.originalText}\n\n`;
            content += "Rewritten Text:\n";
            content += `${entry.rewrittenText}\n\n`;
            content += "------------------------\n\n";
        });

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `writing-history-${
            new Date().toISOString().split("T")[0]
        }.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDelete = (index: number) => {
        console.log("Deleting history entry at index:", index);
        onDeleteEntry(index);
        toast({
            title: "Entry deleted",
            description: "The history entry has been removed.",
        });
    };

    if (history.length === 0) return null;

    return (
        <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    <h2>History</h2>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleDownload}
                >
                    <Download className="h-4 w-4" />
                    Download History
                </Button>
            </div>
            <Accordion type="single" collapsible className="w-full">
                {history.map((entry, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-sm">
                            <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4">
                                    <span>{formatDate(entry.timestamp)}</span>
                                    <span className="text-gray-500">
                                        Tone: {entry.tone}, Length:{" "}
                                        {entry.lengthFactor}x
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-50 hover:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(index);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Original
                                    </label>
                                    <div className="p-4 rounded-md bg-gray-50">
                                        <div className="whitespace-pre-wrap">
                                            {entry.originalText}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Rewritten
                                    </label>
                                    <div className="p-4 rounded-md bg-gray-50">
                                        <div className="whitespace-pre-wrap">
                                            {entry.rewrittenText}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default HistorySection;
