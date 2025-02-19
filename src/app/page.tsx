// Home.tsx
import AnimatedPage from "@/components/AnimatedPage";
import TextBoxHome from "@/components/TextBoxHome";
import Image from "next/image";

export default function Home() {
  return (
    <AnimatedPage>
      <div className="relative w-screen h-screen">
        <Image
          src="/home.png"
          alt="Fondo Home"
          fill
          className="object-cover object-center"
          priority
        />
        <TextBoxHome />
      </div>
    </AnimatedPage>
  );
}
