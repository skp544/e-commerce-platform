import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/theme-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className={"p-5"}>
      <div className={"flex w-full justify-end gap-x-5"}>
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className={"font-barlow font-bold text-blue-500"}>Home</h1>
      <Button>Click Me</Button>
    </div>
  );
}
