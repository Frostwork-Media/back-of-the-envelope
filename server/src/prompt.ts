import zodToJsonSchema from "zod-to-json-schema";
import { ZodObject, ZodRawShape, z } from "zod";
import OpenAI from "openai";
import { Stream } from "openai/streaming";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

export async function prompt<T extends ZodRawShape>(
  content: string,
  schema: ZodObject<T>,
  stream: true
): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>>;

export async function prompt<T extends ZodRawShape>(
  content: string,
  schema: ZodObject<T>,
  stream?: false
): Promise<z.infer<ZodObject<T>>>;

export async function prompt<T extends ZodRawShape>(
  content: string,
  schema: ZodObject<T>,
  stream: boolean = false
) {
  try {
    const openai = new OpenAI();

    const output = zodToJsonSchema(schema);

    const params: ChatCompletionCreateParamsBase = {
      messages: [
        {
          role: "user",
          content,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "func",
            parameters: output,
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: {
          name: "func",
        },
      },
      model: "gpt-4-0125-preview",
    };

    if (stream) {
      return openai.chat.completions.create({ ...params, stream });
    }

    const completion = await openai.chat.completions.create({
      ...params,
      stream: false,
    });
    const args =
      completion.choices[0].message.tool_calls?.[0].function.arguments;

    if (!args) throw new Error("No arguments returned");

    return JSON.parse(args) as z.infer<ZodObject<T>>;
  } catch (error) {
    console.error(error);
    throw new Error("Error with prompt");
  }
}
