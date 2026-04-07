import { Toaster } from "@/components/ui/sonner";
import {
  BugIcon,
  CameraIcon,
  NotebookPenIcon,
  NotebookTextIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { useScreenCapture } from "./hooks/useScreenCapture";
import FormPopup from "./FormPopup";

function IssueManagementWidget({
  onCaptureCB,
  onOpenForm,
}: {
  onCaptureCB: () => void;
  onOpenForm: () => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild className="fixed bottom-20 right-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-16 w-16 shadow-xl bg-primary-600"
        >
          <BugIcon className="text-white" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="flex flex-col-reverse gap-2 min-w-0 w-fit shadow-none ring-0 px-0"
      >
        {/* 1️⃣ Screenshot */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-16 w-16 shadow-xl bg-primary-400"
          onClick={onCaptureCB}
        >
          <CameraIcon className="text-white" />
        </Button>

        {/* 2️⃣ Open Form */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-16 w-16 shadow-xl bg-primary-400"
          onClick={onOpenForm}
        >
          <NotebookPenIcon className="text-white" />
        </Button>

        {/* 3️⃣ Extra Button (no change) */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-16 w-16 shadow-xl bg-primary-400"
          onClick={() => console.log("Text button clicked")}
        >
          <NotebookTextIcon className="text-white" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default function App() {
  const { capture } = useScreenCapture();

  const [screenShots, setScreenShots] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCaptureScreenShot = async () => {
    try {
      const image = await capture();
      setScreenShots((prev) => [...prev, image]);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  return (
    <div className="care-issue-management-fe-container">
      <Toaster position="top-right" richColors expand theme="light" />

      <IssueManagementWidget
        onCaptureCB={handleCaptureScreenShot}
        onOpenForm={() => setIsFormOpen(true)}
      />

      {isFormOpen && (
        <FormPopup onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}