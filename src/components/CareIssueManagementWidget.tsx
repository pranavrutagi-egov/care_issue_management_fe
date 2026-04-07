import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BugIcon, NotebookPenIcon } from "lucide-react";
import FormPopup from "../FormPopup"; // relative path

interface CareIssueManagementWidgetProps {
  onCaptureCB?: () => void; // optional callback for screenshot
}

export default function CareIssueManagementWidget({ onCaptureCB }: CareIssueManagementWidgetProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-10 flex flex-col gap-2">
      {/* Bug Button */}
      <Button variant="outline" size="icon" onClick={onCaptureCB}>
        <BugIcon />
      </Button>

      {/* Notebook Button */}
      <Button variant="outline" size="icon" onClick={() => setIsFormOpen(true)}>
        <NotebookPenIcon />
      </Button>

      {/* Form Popup */}
      {isFormOpen && <FormPopup onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}