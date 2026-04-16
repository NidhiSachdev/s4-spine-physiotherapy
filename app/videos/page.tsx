"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";
import VideoPlayer from "@/components/video/VideoPlayer";

interface Video {
  id: string;
  title: string;
  description: string;
  treatment: string;
  category: string;
  difficulty: string;
  url: string;
  createdAt: string;
}

const CATEGORIES = ["All", "Musculoskeletal", "Neurological", "Sports", "Geriatric", "Post-Surgical"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-success/10 text-success",
  Intermediate: "bg-warning/10 text-warning",
  Advanced: "bg-error/10 text-error",
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/upload")
      .then((res) => res.json())
      .then((data) => {
        if (data.videos && Array.isArray(data.videos)) {
          setVideos(data.videos);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (categoryFilter !== "All" && v.category !== categoryFilter) return false;
      if (difficultyFilter !== "All" && v.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [videos, categoryFilter, difficultyFilter]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Exercise Videos" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal mb-4">
            Exercise <span className="text-orange">Video</span> Library
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Watch guided exercise demonstrations from our physiotherapy experts.
            Follow along at home to support your recovery journey.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 space-y-4"
        >
          <div>
            <h3 className="text-sm font-medium text-charcoal mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === cat
                      ? "bg-orange text-white"
                      : "bg-cream text-orange hover:bg-cream-dark"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-charcoal mb-2">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    difficultyFilter === diff
                      ? "bg-orange text-white"
                      : "bg-cream text-orange hover:bg-cream-dark"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
                <div className="aspect-video bg-warm-bg" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-warm-bg rounded w-3/4" />
                  <div className="h-3 bg-warm-bg rounded w-full" />
                  <div className="h-3 bg-warm-bg rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cream text-orange mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-charcoal text-lg mb-2">
              No videos found
            </h3>
            <p className="text-muted">
              {videos.length === 0
                ? "Exercise videos are being added. Check back soon!"
                : "No videos match your current filters. Try adjusting them."}
            </p>
          </motion.div>
        )}

        {/* Video grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((video, index) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-orange/30 transition-shadow duration-300"
                >
                  {playingId === video.id ? (
                    <VideoPlayer src={video.url} title={video.title} />
                  ) : (
                    <div
                      className="aspect-video bg-charcoal relative cursor-pointer group"
                      onClick={() => setPlayingId(video.id)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-orange/90 flex items-center justify-center text-white group-hover:bg-orange group-hover:scale-110 transition-all duration-200 shadow-lg">
                          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7L8 5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[video.difficulty] || "bg-white/20 text-white"}`}>
                          {video.difficulty}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-charcoal mb-1.5">
                      {video.title}
                    </h3>
                    <p className="text-muted text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs bg-cream text-orange px-2.5 py-1 rounded-full">
                        {video.category}
                      </span>
                      {video.treatment && (
                        <span className="text-xs bg-warm-bg text-body px-2.5 py-1 rounded-full">
                          {video.treatment}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
