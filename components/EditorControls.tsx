"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface EditorControlsProps {
    tone: string;
    setTone: (tone: string) => void;
    lengthFactor: number[];
    setLengthFactor: (factor: number[]) => void;
}

const EditorControls = ({
    lengthFactor,
    setLengthFactor,
    tone,
    setTone,
}: EditorControlsProps) => {
    return (
        <div className="flex flex-col space-y-6 md:space-y-4">
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Tone
                </label>
                <RadioGroup
                    name="tone"
                    value={tone}
                    onValueChange={setTone}
                    className="flex flex-wrap gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="formal" id="formal" />
                        <label htmlFor="formal">Formal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="casual" id="casual" />
                        <label htmlFor="casual">Casual</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="persuasive" id="persuasive" />
                        <label htmlFor="persuasive">Persuasive</label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-medium text-gray-700">
                        Length
                    </label>
                    <span className="text-sm text-gray-500">
                        {lengthFactor[0]}x
                    </span>
                </div>
                <Slider
                    value={lengthFactor}
                    onValueChange={setLengthFactor}
                    name="length"
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default EditorControls;
