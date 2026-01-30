'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, List, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { YouTubePlayer } from '@/components/video/youtube-player'
import { VideoCard } from '@/components/video/video-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Video {
  id: string
  titulo: string
  descripcion: string | null
  urlYoutube: string
  duracion: number | null
  orden: number
}

interface Paquete {
  id: string
  nombre: string
  descripcion: string | null
  instrucciones: string | null
  nivel: string | null
  lesion: { nombre: string } | null
  videos: Video[]
}

interface VideoPlayerClientProps {
  codigo: string
  paquete: Paquete
}

export function VideoPlayerClient({ codigo, paquete }: VideoPlayerClientProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showList, setShowList] = useState(false)
  
  const currentVideo = paquete.videos[currentVideoIndex]
  const hasNext = currentVideoIndex < paquete.videos.length - 1
  const hasPrev = currentVideoIndex > 0

  const goToNext = () => {
    if (hasNext) setCurrentVideoIndex(currentVideoIndex + 1)
  }

  const goToPrev = () => {
    if (hasPrev) setCurrentVideoIndex(currentVideoIndex - 1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showNav={false} />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href={`/ver/${codigo}`}>
                <ArrowLeft className="w-5 h-5" />
                Volver a paquetes
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {paquete.lesion && (
                <Badge variant="secondary">{paquete.lesion.nombre}</Badge>
              )}
              {paquete.nivel && (
                <Badge variant="outline">{paquete.nivel}</Badge>
              )}
            </div>
          </div>

          {/* Título del paquete */}
          <h1 className="text-2xl font-bold mb-6">{paquete.nombre}</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2 space-y-6">
              <YouTubePlayer 
                url={currentVideo.urlYoutube} 
                title={currentVideo.titulo}
              />

              {/* Video Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {currentVideoIndex + 1}
                    </div>
                    <div>
                      <CardTitle>{currentVideo.titulo}</CardTitle>
                      <CardDescription className="text-base">
                        Video {currentVideoIndex + 1} de {paquete.videos.length}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {currentVideo.descripcion && (
                  <CardContent>
                    <p className="text-lg text-muted-foreground">
                      {currentVideo.descripcion}
                    </p>
                  </CardContent>
                )}
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={goToPrev}
                  disabled={!hasPrev}
                  className="flex-1"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Video Anterior
                </Button>
                <Button 
                  size="lg"
                  onClick={goToNext}
                  disabled={!hasNext}
                  className="flex-1"
                >
                  Siguiente Video
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Video List - Desktop */}
            <div className="hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Lista de Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                  {paquete.videos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      titulo={video.titulo}
                      descripcion={video.descripcion}
                      urlYoutube={video.urlYoutube}
                      duracion={video.duracion}
                      orden={index}
                      isActive={index === currentVideoIndex}
                      onClick={() => setCurrentVideoIndex(index)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Video List - Mobile Toggle */}
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full mb-4"
                onClick={() => setShowList(!showList)}
              >
                <List className="w-5 h-5" />
                {showList ? 'Ocultar' : 'Ver'} Lista de Videos ({paquete.videos.length})
              </Button>
              
              {showList && (
                <Card>
                  <CardContent className="p-0">
                    {paquete.videos.map((video, index) => (
                      <VideoCard
                        key={video.id}
                        titulo={video.titulo}
                        descripcion={video.descripcion}
                        urlYoutube={video.urlYoutube}
                        duracion={video.duracion}
                        orden={index}
                        isActive={index === currentVideoIndex}
                        onClick={() => {
                          setCurrentVideoIndex(index)
                          setShowList(false)
                        }}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
