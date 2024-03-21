"use client";

import { Microphone2 } from "iconsax-react";
import { NavIconButton } from "./NavIconButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/cn";

export function RecordButton({
  submitRecording,
}: {
  submitRecording: (text: string) => void;
}) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const streamData = useRef<Blob[]>([]);

  // Transcribe the audio
  const transcribe = useCallback(async () => {
    if (!streamData.current) return;
    const audioBlob = new Blob(streamData.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { message: string };

    return data?.message;
  }, []);

  // Set the media recorder stream when access is granted
  useEffect(() => {
    if (hasAccess === true) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);

          mediaRecorder.current.ondataavailable = (e) => {
            streamData.current.push(e.data);
          };

          mediaRecorder.current.onstop = async () => {
            // get the blob
            const blob = new Blob(streamData.current, {
              type: "audio/wav",
            });

            // if blob is too short, alert user to press and hold
            if (blob.size < 500) {
              window.alert("Please press and hold to record");
              return;
            }

            // transcribe the audio
            const message = await transcribe();

            if (message) {
              submitRecording(message);
            }
          };
        })
        .catch(console.error);
    }
  }, [hasAccess, submitRecording, transcribe]);

  // handle mouse down
  const handleMouseDown = useCallback(() => {
    // If access unknown, do nothing
    if (hasAccess === null) {
      requestMicrophoneAccess()
        .then(() => {
          setHasAccess(true);
        })
        .catch(() => {
          setHasAccess(false);
        });
      return;
    } else if (hasAccess === false) {
      window.alert(
        "Microphone access disabled. Please enable it in your browser settings.",
      );
      return;
    } else {
      if (recording) return;

      // Clear Data
      streamData.current = [];

      setRecording(true);
      mediaRecorder.current?.start();
    }
  }, [hasAccess, recording]);

  const handleMouseUp = useCallback(() => {
    if (!recording) return;
    setRecording(false);
    mediaRecorder.current?.stop();
  }, [recording]);

  return (
    <NavIconButton
      icon={Microphone2}
      type="button"
      className={cn({
        // "cursor-pointer": hasAccess === true && !recording,
        "!hover:text-white": hasAccess === null,
        "cursor-not-allowed opacity-50": hasAccess === false,
        "text-yellow-300/70 hover:text-yellow-400":
          hasAccess === true && !recording,
        "bg-red-500/30 !text-red-500 transition-none": recording,
      })}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
}

function requestMicrophoneAccess() {
  return navigator.mediaDevices.getUserMedia({ audio: true });
}
