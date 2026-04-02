import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export async function captureVisibleScreen(): Promise<string> {
//     TODO: implement screen capture logic here
// }
