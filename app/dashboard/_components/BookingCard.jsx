import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { useState } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  position: relative;
  width: 100%;
  max-width: 150px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #17795e;
  background-color: #209978;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  transition: all 0.3s ease-in-out;
  margin-top: 10px;

  &:hover {
    background-color: #17795e;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: #146c54;
    border-color: #146c54;
  }

  &:active {
    border: 1px solid #146c54;
    background-color: #146c54;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 10px;
  color: red;
  font-size: 14px;
`;

export function BookingCard({ room }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);

    try {
      const fileUrl = room?.ai_generated_url || "/ai-generated-image.jpg";

      // Call the API route to download the file
      const response = await fetch(
        `/api/download?fileUrl=${encodeURIComponent(fileUrl)}`
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to download the file");
      }

      const data = await response.json();
      if (data.fileUrl) {
        // Trigger a download in the browser
        const link = document.createElement("a");
        link.href = data.fileUrl;
        link.download = "ai_image.jpg";
        link.click();
      } else {
        throw new Error("File URL not returned by the server");
      }
    } catch (error) {
      setDownloadError(error.message || "An error occurred while downloading the file");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="flex flex-col w-full max-w-[26rem] shadow-lg rounded-lg overflow-hidden mx-auto">
      <CardHeader className="relative p-0">
        <div className="w-full h-[200px] overflow-hidden flex justify-center items-center bg-gray-100">
          <img
            src={room?.ai_generated_url || "/ai-generated-image.jpg"}
            alt="AI generated room image"
            className="object-cover h-full w-full"
          />
        </div>
      </CardHeader>

      <CardBody className="p-4">
        <Typography variant="h5" color="blue-gray" className="font-semibold">
          Room Type: {room?.room_type || "N/A"}
        </Typography>
        <Typography color="gray" className="mt-1">
          Design Style: {room?.design_type || "N/A"}
        </Typography>
      </CardBody>

      <CardFooter className="p-4 mb-3 flex flex-col items-center">
        <StyledButton
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full max-w-[150px] mt-2"
        >
          {isDownloading ? "Downloading..." : "Download"}
        </StyledButton>
        {downloadError && <ErrorMessage>{downloadError}</ErrorMessage>}
      </CardFooter>
    </Card>
  );
}
