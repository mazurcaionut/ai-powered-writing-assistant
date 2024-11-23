import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

// const parser = StructuredOutputParser.fromZodSchema(
//     z.object({
//         sentimentScore: z
//             .number()
//             .describe(
//                 "sentiment of the text and rated on a scale of -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
//             ),
//         mood: z
//             .string()
//             .describe("the mood of the person who wrote the journal entry."),
//         subject: z.string().describe("the subject of the journal entry."),
//         summary: z.string().describe("quick summary of the entire entry."),
//         negative: z
//             .boolean()
//             .describe(
//                 "is the journal entry negative? (i.e does it contain negative emotions?)."
//             ),
//         color: z
//             .string()
//             .describe(
//                 "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
//             ),
//     })
// );

interface InputProps {
    content: string;
    tone: string;
    length: string;
}

const getPrompt = async ({ content, tone, length }: InputProps) => {
    // const format_instructions = parser.getFormatInstructions();

    const prompt = new PromptTemplate({
        template:
            "Rewrite the following sentence in a {tone}, making it {length}: {content}",

        // "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
        inputVariables: ["content", "tone", "length"],
        // partialVariables: { format_instructions },
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
        // return parser.parse(result);
        return result;
    } catch (e) {
        console.error(e);
    }
};

// export const qa = async (question, entries) => {
//     const docs = entries.map((entry) => {
//         return new Document({
//             pageContent: entry.content,
//             metadata: { id: entry.id, createdAt: entry.createdAt },
//         });
//     });

//     const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
//     const chain = loadQARefineChain(model);
//     const embeddings = new OpenAIEmbeddings();
//     const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
//     const relevantDocs = await store.similaritySearch(question);
//     const res = await chain.invoke({
//         input_documents: relevantDocs,
//         question,
//     });

//     return res.output_text;
// };
