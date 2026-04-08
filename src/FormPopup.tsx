import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FormPopupProps {
  onClose: () => void;
}

export default function FormPopup({ onClose }: FormPopupProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // ✅ Issue options added
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

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

            {/* ✅ Replaced Input with dropdown */}
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
            <Input type="file" multiple onChange={handleFileChange} />

            {files.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {files.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={idx}
                      className="relative border rounded-md overflow-hidden w-24 h-24"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={url}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-xs text-gray-700 text-center p-1">
                          {file.name}
                        </div>
                      )}

                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={() => removeFile(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button type="submit" className="bg-green-500 hover:bg-green-600">
            Submit Issue
          </Button>
        </form>
      </div>
    </div>
  );
}