import Dashboard from "@/components/Dashboard";
import Wardrobe from "@/components/Wardrobe";

export default function myCloset() {
  return (
    <>
    <div className="flex flex-col w-1/2 min-h-screen bg-inherit">
    <Wardrobe />
    </div>

    <div className="flex flex-col w-1/2 min-h-screen bg-inherit">
    <Dashboard />
    </div>
    </>
  );
}
