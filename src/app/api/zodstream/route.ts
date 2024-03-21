import { OAIStream, withResponseModel } from "zod-stream";
import OpenAI from "openai";

import { schema } from "~/lib/schema";

const openai = new OpenAI();

export async function POST(request: Request) {
  const { messages } = (await request.json()) as IRequest;

  const params = withResponseModel({
    response_model: { schema: schema, name: "Users extraction and message" },
    params: {
      messages,
      model: "gpt-4",
    },
    mode: "TOOLS",
  });

  const extractionStream = await openai.chat.completions.create({
    ...params,
    stream: true,
  });

  return new Response(
    OAIStream({
      res: extractionStream,
    }),
  );
}
