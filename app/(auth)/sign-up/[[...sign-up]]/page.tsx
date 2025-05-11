import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="grid h-screen w-full place-content-center">
      <SignUp />
    </div>
  );
};
export default SignUpPage;
