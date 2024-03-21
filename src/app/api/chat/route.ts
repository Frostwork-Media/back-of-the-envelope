/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse, type Message } from "ai";
import zodToJsonSchema from "zod-to-json-schema";
import { z } from "zod";
import type { ChatCompletionMessage } from "openai/resources/index.mjs";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const openai = new OpenAI();

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = (await req.json()) as {
    messages: ChatCompletionMessage[];
  };

  const mostRecentMessage = messages[messages.length - 1]!;

  const output = zodToJsonSchema(
    z.object({
      js: z.string(),
    }),
  );

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    tools: [
      {
        type: "function",
        function: {
          name: "describe_pgm",
          parameters: output,
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: {
        name: "describe_pgm",
      },
    },
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "user",
        content: `You are a forecasting assistant. I will ask you to forecast a topic, and you will create a probabilistic graphical model based on my question. You will encode the model using javascript and the following rules:

For each variable you will give it a \`title\` and \`description\` like so:
  
// title: Variable Title
// description: This is the description
const forecastAccuracy = 0.9;

Unless a variable is fixed (days in a week, cups in a gallon), you should make it adjustable and give it a reasonable range and step. To make a variable which can be adjusted by the user, you will use the following syntax:

// title: Variable Title
// description: Adjust the forecast accuracy within a range from 0 to 1.
// control: range 0 1 0.1
const forecastAccuracy = 0.9;

All variable declarations should be on a single line.

This is good:

// title: Variable Title
// description: This is the description
const forecastAccuracy = someVar + someOtherVar / anotherVar;

This is bad:

// title: Variable Title
// description: This is the description
const forecastAccuracy = someVar;
forecastAccuracy = forecastAccuracy + someOtherVar;
forecastAccuracy = forecastAccuracy / anotherVar;

Don't use while or for loops. Don't include any return statements in your code. I will handle that for you.
`,
      },
      mostRecentMessage,
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
