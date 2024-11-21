import React, { useState } from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";
import AiOutputDialog from "./AiOutputDialog";

function RoomDesign({ room }) {
  const [openDialog, setOpenDialog] = useState(false);

  // Handle Dialog Open/Close
  const onClickHandler = () => {
    setOpenDialog(true);
  };
  
  return (
    <div
      className="shadow-md rounded-md cursor-pointer border border-gray-200 hover:shadow-lg transition-shadow"
      onClick={onClickHandler}
    >
      {/* Before-After Slider on Card */}
      <ReactBeforeSliderComponent
        firstImage={{
          imageUrl: room?.image_url || "/fallback-original-image.png",
        }}
        secondImage={{
          imageUrl: room?.ai_generated_url || "/fallback-ai-image.png",
        }}
      />
  
      {/* Room Details */}
      <div className="p-4">
        <h2 className="text-sm font-black">Room Type: {room?.room_type}</h2>
        <h2 className="text-sm font-medium">Design Type: {room?.design_type}</h2>
      </div>
  
      {/* Dialog */}
      <AiOutputDialog
        aiImage={room?.ai_generated_url}
        orgImage={room?.image_url}
        closeDialog={() => {
          console.log("Closing Dialog...");
          setOpenDialog(false);
        }}
        openDialog={openDialog}
      />

    </div>
  );
}  
export default RoomDesign;
