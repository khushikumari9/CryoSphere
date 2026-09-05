import { Bookmark, Heart, MessageCircle, Send, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import camp from "@/assets/feed-camp.jpg";
import icecore from "@/assets/feed-icecore.jpg";
import penguins from "@/assets/feed-penguins.jpg";
import station from "@/assets/feed-station.jpg";
import vessel from "@/assets/feed-vessel.jpg";

type Post = {
  id: string;
  author: string;
  handle: string;
  location: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
};

const posts: Post[] = [
  {
    id: "p1",
    author: "Halley VI Station",
    handle: "@halley_vi",
    location: "Brunt Ice Shelf, Antarctica",
    image: station,
    caption:
      "Midnight sun over the shelf. Automated weather masts logging every 60 seconds while the katabatic winds settle.",
    likes: 2431,
    comments: 112,
  },
  {
    id: "p2",
    author: "RV Polar Meridian",
    handle: "@rv_meridian",
    location: "Weddell Sea",
    image: vessel,
    caption:
      "Breaking into first-year ice on transect 14. CTD casts every six nautical miles, salinity anomaly holding at +0.4 PSU.",
    likes: 1875,
    comments: 84,
  },
  {
    id: "p3",
    author: "Dr. Ana Petrova",
    handle: "@cryocore",
    location: "Dome C Traverse",
    image: icecore,
    caption:
      "Core 312 out clean — 41 cm of bubble-rich firn. Layer counting suggests a strong 1987 volcanic marker.",
    likes: 3204,
    comments: 196,
  },
  {
    id: "p4",
    author: "Camp Sigma",
    handle: "@camp_sigma",
    location: "Ross Ice Shelf",
    image: camp,
    caption:
      "Twelve tents up before the wind turned. Deep-field camp operational, first radar transect starts at 0600.",
    likes: 1520,
    comments: 63,
  },
  {
    id: "p5",
    author: "Seabird Survey Team",
    handle: "@icecolony",
    location: "Atka Bay",
    image: penguins,
    caption:
      "Colony count complete — 4,180 adults on the fast ice this morning, up slightly on last season.",
    likes: 4890,
    comments: 241,
  },
];

function FeedCard({
  post,
  muted,
  onToggleMute,
}: {
  post: Post;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setPlaying(entries[0]?.isIntersecting ?? false),
      {
        threshold: 0.6,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className="glass shimmer-border overflow-hidden rounded-3xl">
      <header className="flex items-center gap-3 p-4">
        <div className="bg-brand grid h-10 w-10 place-items-center rounded-full text-xs font-bold text-primary-foreground">
          {post.author.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{post.author}</p>
          <p className="truncate text-xs text-muted-foreground">
            {post.handle} · {post.location}
          </p>
        </div>
        <span
          className={`ml-auto rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            playing ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {playing ? "Playing" : "Paused"}
        </span>
      </header>

      <div className="relative aspect-square overflow-hidden">
        <img
          src={post.image}
          alt={post.caption}
          loading="lazy"
          width={1024}
          height={1024}
          className={`h-full w-full object-cover transition-transform duration-[9000ms] ease-linear ${
            playing ? "scale-110" : "scale-100"
          }`}
        />
        <button
          onClick={onToggleMute}
          aria-label={muted ? "Unmute feed" : "Mute feed"}
          className="glass absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full text-foreground"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <div className="absolute left-3 top-3 h-1.5 w-24 overflow-hidden rounded-full bg-background/40">
          <div
            className={`bg-brand h-full ${playing ? "w-full transition-[width] duration-[9000ms] ease-linear" : "w-0"}`}
          />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-label="Like post"
            className={`transition-transform hover:scale-110 ${liked ? "text-destructive" : "text-foreground"}`}
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </button>
          <MessageCircle className="h-5 w-5" />
          <Send className="h-5 w-5" />
          <Bookmark className="ml-auto h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">
          {(post.likes + (liked ? 1 : 0)).toLocaleString()} likes · {post.comments} comments
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{post.handle}</span> {post.caption}
        </p>
      </div>
    </article>
  );
}

export function MediaFeed({ compact = false }: { compact?: boolean }) {
  const [muted, setMuted] = useState(true);
  const list = compact ? posts.slice(0, 4) : posts;

  return (
    <div className={compact ? "grid gap-6 md:grid-cols-2" : "mx-auto grid max-w-xl gap-6"}>
      {list.map((p) => (
        <FeedCard key={p.id} post={p} muted={muted} onToggleMute={() => setMuted((m) => !m)} />
      ))}
    </div>
  );
}
