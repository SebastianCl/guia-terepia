'use client'

import { extractYoutubeId } from "@/lib/utils"

interface YouTubePlayerProps {
  url: string
  title?: string
  className?: string
  autoplay?: boolean
}

export function YouTubePlayer({ url, title = "Video", className = "", autoplay = false }: YouTubePlayerProps) {
  const videoId = extractYoutubeId(url)
  
  if (!videoId) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-xl aspect-video ${className}`}>
        <p className="text-lg text-muted-foreground">URL de video no válida</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`

  return (
    <div className={`relative aspect-video rounded-xl overflow-hidden bg-black ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
