import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function EmptyState() {
    return (
        <div className="flex items-center justify-center mt-10 flex-col">
            <Image
                src={"/room.png"}
                alt="Default AI-room image"
                width={200}
                height={200}
                priority
            />
            <h2 className="font-medium text-lg text-gray-500">
                Create AI Interior Design
            </h2>
            <Link href={"/dashboard/create-new"}>
                <Button className="mt-5">+ Redesign</Button>
            </Link>
        </div>
    );
}

export default EmptyState;
