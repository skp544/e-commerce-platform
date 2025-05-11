"use client";

import React from "react";
import { DashboardSidebarMenuInterface } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavAdmin = ({
  menuLinks,
}: {
  menuLinks: DashboardSidebarMenuInterface[];
}) => {
  const pathname = usePathname();

  return (
    <nav className={"relative grow"}>
      <Command className={"rounded-lg overflow-visible bg-transparent"}>
        <CommandInput placeholder={"Search..."} />
        <CommandList className={"py-2"}>
          <CommandEmpty>No Links Found</CommandEmpty>
          <CommandGroup className={"overflow-visible pt-0 relative"}>
            {menuLinks.map((link, index) => {
              let icon;
              const iconSearch = icons.find((icon) => icon.value === link.icon);
              if (iconSearch) {
                icon = <iconSearch.path />;
              }
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full, cursor-pointer", {
                    "bg-accent text-accent-foreground": pathname === link.link,
                  })}
                >
                  <Link
                    href={link.link}
                    className={
                      "flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                    }
                  >
                    {icon} <span> {link.label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
};
export default NavAdmin;
