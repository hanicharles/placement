import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — REVA RACE" },
      {
        name: "description",
        content: "Contact REVA Academy for Corporate Excellence (RACE).",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/image/reva_logi.png" alt="REVA University" className="h-14 sm:h-16 w-auto object-contain" />
          </Link>
          <SiteNav />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-black text-neutral-900">Contact</h1>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            For official contact information, please visit the RACE website.
          </p>
          <a
            href="https://race.reva.edu.in/contact-us/"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center rounded-md bg-[#E65100] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            Open RACE Contact Us Page
          </a>
        </section>
      </main>
    </div>
  );
}

