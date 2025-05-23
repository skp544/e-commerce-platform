import React from "react";
import { User } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserInfo = ({ user }: { user: User | null }) => {
  const role = user?.privateMetadata?.role?.toString();

  return (
    <div className={""}>
      <div>
        <Button
          className={"w-full mt-5 mb-4 flex items-center justify-between py-10"}
          variant={"ghost"}
        >
          <div className={"flex items-center text-left gap-2"}>
            <Avatar className={"w-16 h-16"}>
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.firstName || "user"}
              />
              <AvatarFallback className={"bg-primary text-white"}>
                {user?.firstName}
              </AvatarFallback>
            </Avatar>

            <div className={"flex flex-col gap-y-1"}>
              {user?.firstName} {user?.lastName}
              <span className={"text-muted-foreground"}>
                {user?.emailAddresses[0]?.emailAddress}
              </span>
              <span className={"w-fit"}>
                <Badge variant={"secondary"} className={"capitalize"}>
                  {role?.toLocaleLowerCase()} Dashboard
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
export default UserInfo;
