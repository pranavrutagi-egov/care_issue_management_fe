import { sleep } from "@/lib/utils";
import { useRef, useEffect } from "react";

export function useScreenCapture() {
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = async (): Promise<string> => {
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
      }

      await sleep(250);

      const track = streamRef.current.getVideoTracks()[0];
      if (!track) throw new Error("No video track available");

      if (!("ImageCapture" in window)) {
        throw new Error("ImageCapture not supported");
      }

      const imageCapture = new (window as any).ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();

      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");
      ctx.drawImage(bitmap, 0, 0);

      return canvas.toDataURL("image/png");
    } catch (err) {
      console.error("Screen capture failed:", err);
      throw err;
    } finally {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  return { capture };
}