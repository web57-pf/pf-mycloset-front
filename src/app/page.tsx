import AnimatedPage from "@/components/AnimatedPage";
import TextBoxHome from "@/components/TextBoxHome";
import Image from "next/image";
import { AuthProvider } from "@/contexts/authContext";

export default function Home() {
  return (
    <AuthProvider>

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
    </AuthProvider>
  );
}
