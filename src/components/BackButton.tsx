import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <div className="mx-auto w-[min(1200px,94vw)] pt-4">
      <button
        onClick={() => router.history.back()}
        className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03]"
      >
        <ArrowLeft className="h-4 w-4 text-accent" /> Back
      </button>
    </div>
  );
}
