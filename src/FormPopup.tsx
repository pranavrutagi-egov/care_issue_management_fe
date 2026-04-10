import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FormPopupProps {
  onClose: () => void;
  screenShots?: string[];
}

// ✅ ADDED: defined allowed MIME types as a Set outside the component so it's
// not recreated on every render. This is the real enforcement gate — the
// `accept` attribute on the input only filters the file picker UI, but a user
// can bypass that by switching to "All Files" in the dialog. This Set check
// runs in JavaScript regardless of how the file was selected, so there's no
// way around it. Using a Set (vs an array) makes the lookup O(1) and is easy
// to extend — just add a new string if you ever need to allow another format.
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export default function FormPopup({ onClose, screenShots = [] }: FormPopupProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [capturedScreenshots, setCapturedScreenshots] = useState<string[]>(screenShots);
const [fileError, setFileError] = useState(false);

  const issueOptions = [
    "OPD Wait Time",
    "Lab Result Delay",
    "Bed Not Available",
    "Billing Issue",
    "Staff Behaviour",
    "Medicine Not Available",
    "Food Quality Issue",
    "Cleanliness Issue",
    "Login Issue",
    "System Slow",
    "Data Not Saving",
    "Report Generation Error",
    "Printer Issue",
  ];

  // ✅ CHANGED: added two-layer file validation here.
  // Layer 1 (outer door) — the `accept` attribute on the <Input> below filters
  // what the file picker shows by default, guiding the user toward images.
  // Layer 2 (inner door, this function) — filters selected files against
  // ALLOWED_TYPES before they ever enter state. Any file that slips past the
  // picker UI (e.g. by choosing "All Files") gets silently dropped here,
  // and the user is informed via an alert so they're never left confused.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);

      const validFiles = selected.filter((file) => ALLOWED_TYPES.has(file.type));

      setFileError(validFiles.length < selected.length);
      
      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const removeScreenshot = (idx: number) => {
    setCapturedScreenshots((prev) => prev.filter((_, i) => i !== idx));
  };

  // ✅ ADDED: build a single unified preview array from both states at render time.
  // Think of `files` and `capturedScreenshots` as two separate ingredient bowls —
  // this array is the plate where we combine them just before serving.
  // We do this here (outside JSX) to keep the template clean and readable.
  // The `kind` field is the key detail — it tells the ✕ button which bowl
  // the item originally came from, so it knows which state to update on removal.
  const previewItems = [
    ...files.map((file, idx) => ({
      kind: "file" as const,
      idx,
      // createObjectURL gives us a temporary browser URL to display the File object
      url: URL.createObjectURL(file),
      isImage: file.type.startsWith("image/"),
      label: file.name,
    })),
    ...capturedScreenshots.map((src, idx) => ({
      kind: "screenshot" as const,
      idx,
      // base64 data URLs from canvas.toDataURL() are already valid <img src> values
      url: src,
      isImage: true, // screenshots are always images
      label: `Screenshot ${idx + 1}`,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
    };

    try {
      const response = await fetch("http://localhost:9000/api/issue_flow/issues/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("care_access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Issue saved:", data);
      } else {
        console.error("Backend error:", data);
      }
    } catch (err) {
      console.error("Network error:", err);
    }

    setTitle("");
    setDescription("");
    setFiles([]);
    setCapturedScreenshots([]);
    setFileError(false); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-[520px] max-w-full relative shadow-2xl flex flex-col gap-6">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center">Submit Issue</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Title</Label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select issue type
              </option>
              {issueOptions.map((issue, idx) => (
                <option key={idx} value={issue}>
                  {issue}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Description</Label>
            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Attach Files</Label>

            {/* ✅ CHANGED: added `accept` to restrict the file picker UI to image
                formats only. This is the outer door — it makes the picker default
                to showing only images. The real enforcement happens in
                handleFileChange above via the ALLOWED_TYPES check. */}
            <Input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={handleFileChange}
            />
            {fileError && (
  <p className="text-xs text-red-500 mt-1">
    Only image files (PNG, JPG, WebP, GIF) are allowed. Other files were ignored.
  </p>
)}

            {/* ✅ CHANGED: replaced the old `files.map(...)` block with a single
                unified grid that renders previewItems — which contains both uploaded
                files and captured screenshots merged together.
                The user sees one consistent grid regardless of the source. */}
            {previewItems.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {previewItems.map((item, i) => (
                  <div
                    key={i}
                    className="relative border rounded-md overflow-hidden w-24 h-24"
                  >
                    {item.isImage ? (
                      // Both image files and screenshots render the same way here
                      <img
                        src={item.url}
                        alt={item.label}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      // Non-image uploaded files (PDFs, docs, etc.) show their filename
                      <div className="flex items-center justify-center w-full h-full text-xs text-gray-700 text-center p-1">
                        {item.label}
                      </div>
                    )}

                    {/* ✅ ADDED: small label only on screenshots so the user can
                        visually distinguish them from manually uploaded files */}
                    {item.kind === "screenshot" && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                        Screenshot
                      </span>
                    )}

                    {/* ✅ CHANGED: the ✕ button now checks `kind` to decide which
                        state to update — removeFile for uploads, removeScreenshot
                        for captures. The two source states stay fully independent. */}
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={() =>
                        item.kind === "file"
                          ? removeFile(item.idx)
                          : removeScreenshot(item.idx)
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            style={{
              backgroundColor: "transparent",
              backgroundImage: "linear-gradient(in oklab, rgb(4, 108, 78) 0%, rgb(3, 84, 63) 100%)",
              borderColor: "rgb(1, 71, 55)",
              borderWidth: "0.8px",
              borderStyle: "solid",
              borderRadius: "6px",
              boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)",
              color: "rgb(255, 255, 255)",
              columnGap: "8px",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Submit Issue
          </Button>
        </form>
      </div>
    </div>
  );
}