import Image from "next/image"
import { Play } from "lucide-react"
import { extractYoutubeId, getYoutubeThumbnail, formatDuration } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface VideoCardProps {
  titulo: string
  descripcion?: string | null
  urlYoutube: string
  duracion?: number | null
  onClick?: () => void
  isActive?: boolean
  orden?: number
}

export function VideoCard({ 
  titulo, 
  descripcion, 
  urlYoutube, 
  duracion, 
  onClick,
  isActive = false,
  orden
}: VideoCardProps) {
  const videoId = extractYoutubeId(urlYoutube)
  const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId, 'mq') : null

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex gap-4 p-4 rounded-xl text-left transition-all",
        "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring",
        isActive && "bg-accent ring-2 ring-primary"
      )}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-muted">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={titulo}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {duracion && (
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-sm px-2 py-0.5 rounded">
            {formatDuration(duracion)}
          </span>
        )}
        {orden !== undefined && (
          <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full">
            {orden + 1}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-semibold line-clamp-2">{titulo}</h4>
        {descripcion && (
          <p className="mt-1 text-base text-muted-foreground line-clamp-2">
            {descripcion}
          </p>
        )}
      </div>
    </button>
  )
}
