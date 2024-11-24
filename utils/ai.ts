import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        rewrittenContent: z
            .string()
            .describe(
                `Rewritten version of the original text, taking into account the tone, length and content specified in the input.`
            ),
        explanation: z
            .string()
            .describe(
                "explanation of how the rewritten version improves the original."
            ),
    })
);

interface InputProps {
    content: string;
    tone: string;
    length: string;
}

const getPrompt = async ({ content, tone, length }: InputProps) => {
    const format_instructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
        template:
            "Rewrite the following sentence in a {tone}, making it {length}: {content}. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}",

        // "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
        inputVariables: ["content", "tone", "length"],
        partialVariables: { format_instructions },
    });

    const input = await prompt.format({
        content,
        tone,
        length,
    });

    return input;
};

export const analyze = async (props: InputProps) => {
    const input = await getPrompt(props);

    const model = new OpenAI({
        temperature: 1,
        modelName: "gpt-3.5-turbo",
    });
    const result = await model.invoke(input);

    try {
        return parser.parse(result);
    } catch (e) {
        console.error(e);
    }
};
