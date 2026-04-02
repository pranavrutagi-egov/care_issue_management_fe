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
import WidgetButton from "./components/common/button";
// import { captureVisibleScreen } from "./lib/utils";

function IssueManagementWidget({ onCaptureCB }: { onCaptureCB: () => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <WidgetButton
          onClick={onCaptureCB}
          className="fixed bottom-20 right-10"
        >
          <BugIcon className="text-white" />
        </WidgetButton>
      </PopoverTrigger>
      <PopoverContent className="right-10 flex flex-col-reverse gap-4 border-none shadow-none min-w-0 w-fit ring-0">
        <WidgetButton type="secondary">
          <CameraIcon className="text-white" />
        </WidgetButton>

        <WidgetButton type="secondary">
          <NotebookPenIcon className="text-white" />
        </WidgetButton>

        <WidgetButton type="secondary">
          <NotebookTextIcon className="text-white" />
        </WidgetButton>
      </PopoverContent>
    </Popover>
  );
}

export default function App() {
  // const [screenShots, setScreenShots] = useState<string[]>([]);

  const handleCaptureScreenShot = async () => {
    // TODO: capture screen shot and save to state
    //   try {
    //     const image = await captureVisibleScreen();
    //     setScreenShots((prev) => [...prev, image]);
    //   } catch (error) {
    //     console.error("Error capturing screenshot:", error);
    //   }
  };

  return (
    <div className="care-issue-management-fe-container">
      <Toaster position="top-right" richColors expand theme="light" />
      <IssueManagementWidget onCaptureCB={handleCaptureScreenShot} />
    </div>
  );
}
