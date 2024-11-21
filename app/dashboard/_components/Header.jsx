"use client";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import Link from "next/link";
function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="p-5 shadow-sm flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} width={40} height={40} alt="logo" />
        <h2 className="font-bold text-lg">RestNest</h2>
      </div>
      <Link href="/dashboard/pricing">
      <Button variant="ghost" className="rounded-full text-primary">
        Buy More Credits
      </Button>
      </Link>
      <div className="flex gap-7 items-center">
        <div className="flex gap-2 p-1 items-center bg-slate-200 px-3 rounded">
          <Image src={"/heart.png"} alt="star" width={20} height={20} />
          <h2>{userDetail?.credits}</h2>
        </div>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
