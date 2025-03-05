"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Swal from "sweetalert2";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user === null) {
                Swal.fire({
                    icon: "warning",
                    title: "Acceso restringido",
                    text: "Primero debes iniciar sesión para poder continuar",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    router.push("/login");
                });
            } else {
                setChecked(true);
            }
        }
    }, [user, loading, router]);

    if (loading || !checked) return <p>Cargando...</p>; 

    return <>{children}</>;
}
