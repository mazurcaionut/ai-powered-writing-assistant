"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

interface ExplanationDialogProps {
    originalText: string;
    rewrittenText: string;
    tone: string;
    lengthFactor: number;
}

const ExplanationDialog = ({
    originalText,
    rewrittenText,
    tone,
    lengthFactor,
}: ExplanationDialogProps) => {
    const generateExplanation = () => {
        // This would be replaced with actual AI analysis in production
        return `This rewrite improves the original text in several ways:

1. Tone Adjustment: The text has been adapted to a ${tone} tone, making it more suitable for your intended audience.

2. Length Optimization: The content has been ${
            lengthFactor < 1 ? "condensed" : "expanded"
        } to ${lengthFactor}x the original length while maintaining key information.

3. Structure: The rewritten version improves readability through better paragraph breaks and sentence structure.

4. Clarity: Complex phrases have been simplified while maintaining the core message.`;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Info className="h-4 w-4" />
                    Explain Changes
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Understanding the Improvements</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4 p-4">
                        <div className="whitespace-pre-wrap">
                            {generateExplanation()}
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="font-medium text-sm text-gray-700 mb-2">
                                    Original Text:
                                </h3>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    {originalText}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-sm text-gray-700 mb-2">
                                    Rewritten Text:
                                </h3>
                                <div className="p-3 bg-gray-50 rounded-md text-sm">
                                    {rewrittenText}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ExplanationDialog;
