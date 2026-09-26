"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  { src: "/media/aarti-ceremony-01.mp4", title: "Sacred flames", copy: "The signature multi-tier deep aarti." },
  { src: "/media/aarti-ceremony-03.mp4", title: "Mantra & devotion", copy: "A ceremony led with complete focus and rhythm." },
  { src: "/media/aarti-ceremony-06.mp4", title: "At your celebration", copy: "The atmosphere of Kashi, brought to your venue." },
  { src: "/media/aarti-ceremony-07.mp4", title: "A shared blessing", copy: "A memorable spiritual moment for every guest." },
  { src: "/media/aarti-ceremony-05.mp4", title: "Light of Kashi", copy: "Authentic ritual details, presented with devotion." },
];

export function VideoCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef<number | null>(null);

  function move(direction: number) {
    setCurrent((index) => (index + direction + videos.length) % videos.length);
  }

  const video = videos[current];

  return (
    <div className="video-carousel">
      <div
        className="video-stage"
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
          touchStart.current = null;
        }}
      >
        <video key={video.src} controls autoPlay muted loop playsInline preload="metadata">
          <source src={video.src} type="video/mp4" />
        </video>
        <button className="video-arrow video-arrow-prev" type="button" onClick={() => move(-1)} aria-label="Previous video">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button className="video-arrow video-arrow-next" type="button" onClick={() => move(1)} aria-label="Next video">
          <ChevronRight aria-hidden="true" />
        </button>
        <div className="video-counter" aria-live="polite">
          <span>{String(current + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(videos.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="video-carousel-footer">
        <div>
          <p>Now playing</p>
          <h3>{video.title}</h3>
          <span>{video.copy}</span>
        </div>
        <div className="video-dots" aria-label="Choose a ceremony video">
          {videos.map((item, index) => (
            <button
              className={index === current ? "active" : ""}
              type="button"
              key={item.src}
              onClick={() => setCurrent(index)}
              aria-label={`Play video ${index + 1}: ${item.title}`}
              aria-current={index === current ? "true" : undefined}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
