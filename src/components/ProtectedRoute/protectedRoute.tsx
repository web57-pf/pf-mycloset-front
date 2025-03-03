"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Swal from "sweetalert2";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {  
            Swal.fire({
                icon: "warning",
                title: "Acceso restringido",
                text: "Primero debes iniciar sesión para poder continuar",
                confirmButtonText: "Aceptar",
            }).then(() => {
                router.push("/login");
            });
        }
    }, [user, router]);

    if (user === null) return null; 

    return <>{children}</>;
}
