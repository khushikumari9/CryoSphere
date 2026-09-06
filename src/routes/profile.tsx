import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Check,
  FileText,
  FolderPlus,
  GraduationCap,
  Inbox,
  LogOut,
  Mail,
  Plus,
  Settings,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { useSession } from "@/lib/portal-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile Dashboard — CryoSphere Polar Science Portal" },
      {
        name: "description",
        content:
          "Role-tailored CryoSphere dashboard: repositories, uploaded posts, review queues and account settings.",
      },
      { property: "og:title", content: "Your Profile Dashboard — CryoSphere" },
      {
        property: "og:description",
        content: "Repositories, posts, review queues and settings for your CryoSphere account.",
      },
    ],
  }),
  component: ProfilePage,
});

const repositories = [
  { title: "Ross Ice Shelf basal melt series 2019–2026", tag: "Glaciology", items: "412 files" },
  { title: "Atka Bay seabird census", tag: "Ecosystems", items: "88 files" },
  { title: "Amundsen Sea mooring temperatures", tag: "Oceanography", items: "1,204 files" },
];

const myPosts = [
  { title: "Ice core extraction at Dome Sigma", date: "2 Sep 2026", status: "Published" },
  { title: "Katabatic wind event, Station Bravo", date: "28 Aug 2026", status: "Published" },
  { title: "Sea-ice thinning near Atka Bay", date: "21 Aug 2026", status: "In review" },
];

const inbox = [
  {
    from: "l.hansen@polar-inst.org",
    subject: "Ross Ice Shelf basal melt series 2019–2026",
    kind: "Repository",
    when: "10:24",
  },
  {
    from: "m.oyelaran@ncpor.res.in",
    subject: "Himalaya glacier mass-balance report (PDF)",
    kind: "Document",
    when: "09:02",
  },
  {
    from: "s.iqbal@oceanlab.eu",
    subject: "IODP core photo set — 42 images",
    kind: "Media",
    when: "Yesterday",
  },
];

function ProfilePage() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [approved, setApproved] = useState<string[]>([]);
  const [generated, setGenerated] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  if (!session) {
    return (
      <div className="mx-auto w-[min(1200px,94vw)] py-20 text-center">
        <h1 className="text-2xl font-bold">You are signed out</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in from the top bar to open your dashboard.
        </p>
      </div>
    );
  }

  const role = session.role ?? "Other";
  const isScientist = role === "Researcher & Scientist";
  const isAdmin = role === "Admin";

  return (
    <div className="mx-auto w-[min(1200px,94vw)] pb-20 pt-6">
      <header className="glass shimmer-border flex flex-wrap items-center gap-4 rounded-3xl p-6">
        <div className="bg-brand grid h-16 w-16 place-items-center rounded-2xl text-primary-foreground">
          <UserRound className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold">{session.email}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="glass rounded-full px-3 py-1 text-xs font-semibold">{role}</span>
            {session.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                <BadgeCheck className="h-3.5 w-3.5" /> ID verified
              </span>
            )}
          </p>
        </div>
      </header>

      <section className="glass mt-5 rounded-3xl p-6">
        <h2 className="text-lg font-semibold">About this account</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {isScientist &&
            "Field scientist account. You can publish repositories and field posts; every upload is routed to a portal admin for review before it appears publicly."}
          {isAdmin &&
            "Portal administrator account. Everything scientists upload arrives in your review inbox — open an item to read it, then approve or send it back."}
          {!isScientist &&
            !isAdmin &&
            role === "Student or Teacher" &&
            "Learner account. Save lessons, follow expeditions and download classroom-ready datasets."}
          {!isScientist && !isAdmin && role === "Other" &&
            "General explorer account. Browse the feed, the globe and live station data, and save what matters to you."}
        </p>
      </section>

      {isScientist && (
        <>
          <section className="glass mt-5 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Your repositories</h2>
              <button className="bg-brand inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground">
                <FolderPlus className="h-4 w-4" /> Add repository
              </button>
            </div>
            <ul className="mt-4 divide-y divide-border/60">
              {repositories.map((r) => (
                <li key={r.title} className="flex flex-wrap items-center gap-3 py-3">
                  <FileText className="h-4 w-4 text-accent" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{r.tag}</span>
                  <span className="text-xs text-muted-foreground">{r.items}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass mt-5 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Your posts</h2>
              <button className="bg-brand inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground">
                <Plus className="h-4 w-4" /> Add new post
              </button>
            </div>
            <ul className="mt-4 divide-y divide-border/60">
              {myPosts.map((p) => (
                <li key={p.title} className="flex flex-wrap items-center gap-3 py-3">
                  <Upload className="h-4 w-4 text-accent" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.title}</span>
                  <span className="text-xs text-muted-foreground">{p.date}</span>
                  <span className="glass rounded-full px-3 py-1 text-xs font-semibold">
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-strong shimmer-border mt-5 rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold">Generate posts</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Let the AI agent draft a field post from your latest repository upload.
            </p>
            <button
              onClick={() => {
                setGenerating(true);
                window.setTimeout(() => {
                  setGenerating(false);
                  setGenerated(
                    "Draft: “Basal melt beneath the Ross Ice Shelf rose 4% this season. New phase-sensitive radar records from 412 files show the fastest thinning close to the grounding line — here is what the team saw on the ice.”",
                  );
                }, 1200);
              }}
              disabled={generating}
              className="bg-brand glow mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? "Drafting…" : "Generate posts"}
            </button>
            {generated && (
              <p className="glass mt-4 rounded-2xl p-4 text-sm leading-relaxed">{generated}</p>
            )}
          </section>
        </>
      )}

      {isAdmin && (
        <section className="glass mt-5 rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Inbox className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold">Review inbox</h2>
          </div>
          <ul className="mt-4 space-y-2">
            {inbox.map((m) => {
              const isOpen = open === m.subject;
              const isApproved = approved.includes(m.subject);
              return (
                <li key={m.subject} className="glass rounded-2xl p-4">
                  <button
                    onClick={() => setOpen(isOpen ? null : m.subject)}
                    className="flex w-full flex-wrap items-center gap-3 text-left"
                  >
                    <Mail className="h-4 w-4 text-accent" />
                    <span className="text-xs text-muted-foreground">{m.from}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {m.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">{m.kind}</span>
                    <span className="text-xs text-muted-foreground">{m.when}</span>
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                        <Check className="h-3.5 w-3.5" /> Approved
                      </span>
                    )}
                  </button>
                  {isOpen && (
                    <div className="mt-3 border-t border-border/60 pt-3">
                      <p className="text-sm text-muted-foreground">
                        Submitted for portal review. Check metadata, licensing and station
                        attribution before approving publication.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            setApproved((a) =>
                              a.includes(m.subject) ? a : [...a, m.subject],
                            )
                          }
                          className="bg-brand rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground"
                        >
                          Approve
                        </button>
                        <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
                          Request changes
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {!isScientist && !isAdmin && (
        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Lessons in progress", value: "4 modules" },
            { icon: Bookmark, title: "Saved posts", value: "17 items" },
            { icon: Bell, title: "Expeditions followed", value: "3 campaigns" },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="glass rounded-3xl p-5">
              <Icon className="h-5 w-5 text-accent" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-lg font-bold">{value}</p>
            </div>
          ))}
        </section>
      )}

      <section className="glass mt-5 flex flex-wrap gap-2 rounded-3xl p-5">
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
          <Settings className="h-4 w-4" /> Settings
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold">
          <Bell className="h-4 w-4" /> Notifications
        </button>
        <button
          onClick={() => {
            signOut();
            router.navigate({ to: "/" });
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </section>
    </div>
  );
}
