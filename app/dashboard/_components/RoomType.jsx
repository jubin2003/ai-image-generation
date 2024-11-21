import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function RoomType({ selectedRoomType }) {
    return (
        <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Select Room Type</label>
            <Select onValueChange={(value) => selectedRoomType(value)}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md p-2 hover:border-gray-400 focus:ring focus:ring-blue-200">
                    <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-lg rounded-md mt-2">
                    <SelectItem value="Living Room" className="hover:bg-gray-100 p-2">
                        Living Room
                    </SelectItem>
                    <SelectItem value="Bedroom" className="hover:bg-gray-100 p-2">
                        Bedroom
                    </SelectItem>
                    <SelectItem value="Kitchen" className="hover:bg-gray-100 p-2">
                        Kitchen
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default RoomType;
