import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/theme-toggle";

export default function Home() {
  return (
    <div className={"p-5"}>
      <div className={"flex w-full justify-end"}>
        <ThemeToggle />
      </div>
      <h1 className={"font-barlow font-bold text-blue-500"}>Home</h1>
      <Button>Click Me</Button>
    </div>
  );
}
