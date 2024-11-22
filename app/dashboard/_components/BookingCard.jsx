import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";
  import { Compare } from "@/components/ui/compare";
  import DownloadButton from "@/components/ui/download";
  
  export function BookingCard({ room }) {
    return (
      <Card className="flex flex-col w-full max-w-[26rem] shadow-lg rounded-lg overflow-hidden">
        {/* Card Header with Compare Component */}
        <CardHeader className="relative p-0">
        <CardHeader floated={false} color="blue-gray">
        <img
          src={room?.ai_generated_url || "/ai-generated-image.jpg"}
          alt="ui/ux review check"
        />
      </CardHeader>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </CardHeader>
  
        {/* Card Body with Room Details */}
        <CardBody className="p-4">
          <Typography variant="h5" color="blue-gray" className="font-semibold">
            Room Type: {room?.room_type || "N/A"}
          </Typography>
          <Typography color="gray" className="mt-1">
            Design Style: {room?.design_type || "N/A"}
          </Typography>
        </CardBody>
  
        {/* Card Footer with Download Button */}
        <CardFooter className="p-4 mb-3">
          <DownloadButton className='ml-5'/>
        </CardFooter>
      </Card>
    );
  }
  