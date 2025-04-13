import React, { useContext, useState } from "react";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext, type UserDetail } from "@/context/UserDetailContext";
import Image from "next/image";

const Header = () => {
  const userCtx = useContext(UserDetailContext);
  const { userDetail } = userCtx;
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="p-4 flex justify-between items-center">
      <h2>CodeCraftAI</h2>
      {!userDetail?.name ? (
        <div className="flex gap-5">
          <Button variant="ghost">Sign In</Button>
          <Button
            className="text-white"
            style={{ backgroundColor: Colors.BLUE }}>
            Get Started
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm">{userDetail.name}</span>
          <Image
            src={userDetail.picture || "/user-avatar.svg"}
            alt="user"
            width={35}
            height={35}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
