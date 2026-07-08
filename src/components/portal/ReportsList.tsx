"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fetchMyReports, getReportDownloadUrl, type PatientReport } from "@/lib/reports";
import { signOut } from "@/lib/patient-auth";
import { FadeIn } from "@/components/animations/FadeIn";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportsList() {
  const router = useRouter();
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/portal");
        return;
      }

      try {
        const data = await fetchMyReports();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleDownload(report: PatientReport) {
    setDownloading(report.id);
    try {
      const url = await getReportDownloadUrl(report.file_path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/portal");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-pink-900">My Reports</h1>
            <p className="mt-1 text-sm text-pink-600">
              Download your diagnostic reports as PDF
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-pink-200 px-4 py-2 text-sm font-medium text-pink-600 transition-colors hover:bg-pink-50"
          >
            Sign out
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {reports.length === 0 ? (
          <div className="rounded-3xl border border-pink-100 bg-white/80 p-12 text-center shadow-lg shadow-pink-100/50">
            <p className="text-4xl">📋</p>
            <p className="mt-4 font-medium text-pink-800">No reports available yet</p>
            <p className="mt-2 text-sm text-pink-600">
              Reports appear here once your lab results are ready.
            </p>
          </div>
        ) : (
          <RevealOnScroll className="space-y-4" stagger={0.08}>
            {reports.map((report) => (
              <article
                key={report.id}
                className="group flex items-center gap-4 rounded-2xl border border-pink-100 bg-white/80 p-5 shadow-md shadow-pink-100/40 transition-all hover:border-pink-200 hover:shadow-lg hover:shadow-pink-200/40"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                  📄
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-pink-900">
                    {formatDate(report.created_at)}
                  </p>
                  <p className="text-sm text-pink-500">{formatTime(report.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(report)}
                  disabled={downloading === report.id}
                  className="shrink-0 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-300/40 transition-all hover:shadow-pink-400/50 disabled:opacity-60"
                >
                  {downloading === report.id ? "..." : "Download"}
                </button>
              </article>
            ))}
          </RevealOnScroll>
        )}
      </div>
    </FadeIn>
  );
}
