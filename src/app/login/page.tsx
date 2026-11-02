import { Suspense } from "react";
import { LoginView } from "@/components/login-view";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faff] flex items-center justify-center">Memuat...</div>}>
      <LoginView />
    </Suspense>
  );
}

