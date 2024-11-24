import WritingEditor from "@/components/WritingEditor";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <main className="container py-4 px-4 md:py-8 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 md:mb-8 text-center animate-fade-in">
                        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            AI-Powered
                        </span>
                        <h1 className="mt-4 text-2xl md:text-4xl font-semibold tracking-tight">
                            Writing Assistant
                        </h1>
                        <p className="mt-2 text-sm md:text-base text-gray-600">
                            Start writing and let AI enhance your content
                        </p>
                    </div>
                    <WritingEditor />
                    <Toaster />
                </div>
            </main>
        </div>
    );
}
