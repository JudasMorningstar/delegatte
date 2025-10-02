import { Loader2Icon } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="relative  w-full max-w-md">
        {/* Animated background gradient */}
        <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-2xl" />

        {/* Main card */}
        <div className="relative flex h-full flex-col items-center justify-center gap-y-8 rounded-3xl border border-border/40 bg-gradient-to-b from-background to-muted/30 p-12 shadow-2xl backdrop-blur-sm">
          {/* Spinning loader with glow effect */}
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-md"
              style={{ animationDuration: "2s" }}
            />

            {/* Middle ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/40 to-primary/10 blur-sm" />

            {/* Spinner */}
            <div className="relative rounded-full bg-background p-4 shadow-inner">
              <Loader2Icon className="size-8 animate-spin text-primary" />
            </div>
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-y-3 text-center">
            <h6 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
              {title}
            </h6>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground/90">
              {description}
            </p>
          </div>

          {/* Loading dots animation */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-2 animate-bounce rounded-full bg-primary/60"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
