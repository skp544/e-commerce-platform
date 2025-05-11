import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="grid h-screen w-full place-content-center">
      <SignIn />
    </div>
  );
};
export default SignInPage;
