import { useState } from "react";

type LiteYouTubeProps = {
  id: string;
  title?: string;
  /** Thumbnail quality. `maxresdefault` is sharpest but not every video has it. */
  thumbQuality?: "maxresdefault" | "sddefault" | "hqdefault";
  /** Extra YouTube embed params appended after `autoplay=1`. */
  params?: string;
  className?: string;
};

export function LiteYouTube({
  id,
  title = "YouTube video",
  thumbQuality = "maxresdefault",
  params = "rel=0&modestbranding=1",
  className,
}: LiteYouTubeProps) {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&${params}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={`absolute inset-0 h-full w-full ${className ?? ""}`}
      />
    );
  }

  const thumbUrl = `https://i.ytimg.com/vi/${id}/${thumbQuality}.jpg`;

  return (
    <button
      type="button"
      aria-label={`Play: ${title}`}
      onClick={() => setActivated(true)}
      className={`group absolute inset-0 h-full w-full cursor-pointer overflow-hidden border-0 p-0 ${className ?? ""}`}
      style={{
        background: `#000 url(${thumbUrl}) center / cover no-repeat`,
      }}
    >
      {/* subtle dimmer so the play button always reads */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black/25 transition-colors duration-200 group-hover:bg-black/15"
      />

      {/* YouTube-style play button: rounded-rect pill, red bg, white triangle */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 group-hover:scale-110"
      >
        <svg
          width="80"
          height="56"
          viewBox="0 0 68 48"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          focusable="false"
          style={{
            filter:
              "drop-shadow(0 6px 16px rgba(0,0,0,0.45)) drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
          }}
          className="h-14 w-20 sm:h-16 sm:w-24"
        >
          <path
            d="M66.52 7.74A8 8 0 0 0 60.9 2.1C55.94.7 34 .7 34 .7s-21.94 0-26.9 1.4A8 8 0 0 0 1.48 7.74C.1 12.7.1 24 .1 24s0 11.3 1.38 16.26a8 8 0 0 0 5.62 5.64C12.06 47.3 34 47.3 34 47.3s21.94 0 26.9-1.4a8 8 0 0 0 5.62-5.64C67.9 35.3 67.9 24 67.9 24s0-11.3-1.38-16.26z"
            fill="#f42a41"
            className="transition-[fill] duration-200 group-hover:fill-[#ff0033]"
          />
          <path d="M27 34l18-10L27 14z" fill="#ffffff" />
        </svg>
      </span>
    </button>
  );
}
