"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EmptyState from "./EmptyState";
import RoomDesign from "./RoomDesign";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookingCard } from "./BookingCard";

function Listing() {
  const [userRoomList, setUserRoomList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        setLoading(true);

        // Fetch data from the API route
        const response = await fetch("/api/get-user-rooms");
        const data = await response.json();

        if (response.ok) {
          setUserRoomList(data);
        } else {
          toast.error("Failed to fetch user rooms", { position: "top-left" });
          console.error("Failed to fetch user rooms:", data.error);
        }
      } catch (error) {
        toast.error("Error fetching user rooms", { position: "top-left" });
        console.error("Error fetching user rooms:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRooms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <ToastContainer />
        <h2 className="font-bold text-3xl">AI Room Studio</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Redesign Room</Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-gray-600">Loading your rooms...</p>
          </div>
        )}

        {!loading && userRoomList.length === 0 && (
          <EmptyState message="No designs found. Start redesigning your rooms!" />
        )}

        {!loading && userRoomList.length > 0 && (
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {userRoomList.map((room, index) => (
                <BookingCard key={index} room={room} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Listing;
