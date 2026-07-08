import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportsList } from "@/components/portal/ReportsList";

export const metadata: Metadata = {
  title: "My Reports",
  description: "View and download your diagnostic reports.",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/portal");
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-blush to-rose-glow" />
      <div className="relative mx-auto px-5 md:px-8">
        <ReportsList />
      </div>
    </section>
  );
}
