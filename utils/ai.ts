import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        rewrittenContent: z
            .string()
            .describe(
                "A carefully rewritten version of the original text that maintains the core message while adapting to the requested tone and length. The rewrite should be coherent and natural-sounding."
            ),
        explanation: z
            .string()
            .describe(
                "A detailed explanation of the specific changes made, including how the tone was adjusted and why certain stylistic choices were made to meet the requirements."
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
        `Your task is to rewrite the given text professionally and thoughtfully.

        Input Text: {content}

        Requirements:
        - Adapt the text to a {tone} tone
        - Make it approximately {length}x the original length
        - Maintain the core message and meaning
        - Ensure natural flow and readability
        - Use appropriate vocabulary for the requested tone

        {format_instructions}`,
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
