"use client";

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
    explanation: string;
}

const ExplanationDialog = ({
    originalText,
    rewrittenText,
    explanation,
}: ExplanationDialogProps) => {
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
                    <DialogTitle>Understanding the Improvement</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4 p-4">
                        <div className="whitespace-pre-wrap">{explanation}</div>

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
