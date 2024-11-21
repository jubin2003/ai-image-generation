"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EmptyState from "./EmptyState";
import RoomDesign from "./RoomDesign";

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
          console.error("Failed to fetch user rooms:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user rooms:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRooms();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-3xl">AI Room Studio</h2>
        <Link href="/dashboard/create-new">
          <Button>+ Redesign Room</Button>
        </Link>
      </div>

      {/* Loading State */}
      {loading && <p>Loading your rooms...</p>}

      {/* Empty State */}
      {!loading && userRoomList.length === 0 && (
        <EmptyState message="No designs found. Start redesigning your rooms!" />
      )}

      {/* Room List */}
      {!loading && userRoomList.length > 0 && (
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {userRoomList.map((room, index) => (
              <RoomDesign key={index} room={room} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Listing;
