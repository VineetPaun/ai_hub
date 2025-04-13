import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuid4 } from "uuid";
import Image from "next/image";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";

interface SignInDialogProps {
  openDialog: boolean;
  closeDialog: (value: boolean) => void;
}

const SignInDialog = ({ openDialog, closeDialog }: SignInDialogProps) => {
  const contextValue = useContext(UserDetailContext) ?? {
    userDetail: null,
    setUserDetail: () => { },
  };
  const CreateUser = useMutation(api.users.CreateUser);
  const { setUserDetail } = contextValue;

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );

      const user = userInfo.data;
      await CreateUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        uid: uuid4(),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
      }
      setUserDetail(userInfo?.data);
      closeDialog(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  const handleGoogleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    googleLogin();
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold">Login required</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please login to continue using CodeCraftAI
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex flex-col gap-5">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="flex gap-2 items-center justify-center">
              <Image
                src="/google.png"
                alt="google"
                width={20}
                height={20}
                className="rounded-full"
              />
              Continue with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignInDialog;
