import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import { Button } from "@/components/ui/button";

export default function AiOutputDialog({
  openDialog,
  closeDialog,
  orgImage,
  aiImage,
}) {
  const uploaded_IMAGE = {
    imageUrl: orgImage || "/fallback-original-image.png",
  };
  const ai_generated_IMAGE = {
    imageUrl: aiImage || "/fallback-ai-image.png",
  };

  console.log("Dialog Props: ", { openDialog, orgImage, aiImage });

  return (
<AlertDialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          console.log("Dialog closing via overlay or outside click...");
          closeDialog();
        }
      }}
    >
      <AlertDialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-10" />
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white rounded-lg shadow-lg max-w-lg w-full z-20">
        {/* Screen Reader Accessible Title */}
        <AlertDialogTitle>
          <VisuallyHidden>Before & After Room Design</VisuallyHidden>
        </AlertDialogTitle>

        {/* Visible Title for Users */}
        <h3 className="text-lg font-bold text-center mb-4">
          Before & After Room Design
        </h3>

        {/* Slider for Original and AI Images */}
        <ReactBeforeSliderComponent
          firstImage={uploaded_IMAGE}
          secondImage={ai_generated_IMAGE}
        />

        {/* Close Button */}
        <Button
          className="mt-6 w-full"
          onClick={() => {
            console.log("Close button clicked...");
            closeDialog();
          }}
        >
          Close
        </Button>

      </AlertDialogContent>
    </AlertDialog>
  );
}
