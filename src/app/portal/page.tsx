import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata: Metadata = {
  title: "Patient Portal",
  description: "Sign in to access your diagnostic reports at WASFA Diagnostic Center.",
};

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect("/portal/reports");
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blush to-rose-glow" />
      <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-pink-300/30 blob" />
      <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-pink-400/20 blob" />
      <div className="relative mx-auto px-5 md:px-8">
        <LoginForm />
      </div>
    </section>
  );
}
