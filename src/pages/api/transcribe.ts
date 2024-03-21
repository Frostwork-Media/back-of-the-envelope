import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import OpenAI, { toFile } from "openai";
import { readFileSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
};

// Get the audio file and transcribe it
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  console.log("Request received");

  const form = new IncomingForm();

  const transcription = await new Promise<string>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      if (!files.audio) {
        return reject(new Error("No audio file found"));
      }

      const [file] = files.audio;
      if (!file) {
        return reject(new Error("No audio file found"));
      }

      const buffer = readFileSync(file.filepath);
      toFile(buffer, "audio.wav")
        .then((file) => {
          const openai = new OpenAI();
          openai.audio.transcriptions
            .create({
              file,
              model: "whisper-1",
            })
            .then((response) => {
              resolve(response.text);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  });

  res.status(200).json({ message: transcription });
  return;
}
