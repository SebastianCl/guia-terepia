'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, KeyRound, Save, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generateAccessCode } from '@/lib/utils'

interface Paquete {
  id: string
  nombre: string
  lesion: { nombre: string } | null
}

interface NuevoCodigoFormProps {
  paquetes: Paquete[]
}

export function NuevoCodigoForm({ paquetes }: NuevoCodigoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [codigo, setCodigo] = useState(generateAccessCode())
  const [descripcion, setDescripcion] = useState('')
  const [diasExpiracion, setDiasExpiracion] = useState(30)
  const [usosMaximos, setUsosMaximos] = useState(50)
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState<string[]>([])

  const regenerarCodigo = () => {
    setCodigo(generateAccessCode())
  }

  const togglePaquete = (id: string) => {
    setPaquetesSeleccionados(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (paquetesSeleccionados.length === 0) {
      setError('Debes seleccionar al menos un paquete')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/codigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: codigo.toUpperCase(),
          descripcion,
          diasExpiracion,
          usosMaximos,
          paqueteIds: paquetesSeleccionados
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al crear código')
      }

      router.push('/admin/codigos')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear código')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/codigos">
            <ArrowLeft className="w-5 h-5" />
            Volver a códigos
          </Link>
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <KeyRound className="w-8 h-8" />
          Nuevo Código de Acceso
        </h1>
        <p className="text-xl text-muted-foreground">
          Genera un código para que los pacientes accedan a sus ejercicios
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Código</CardTitle>
          <CardDescription>
            El código será usado por el paciente para ver sus videos asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código */}
            <div className="space-y-2">
              <label className="text-lg font-medium">Código de Acceso</label>
              <div className="flex gap-2">
                <Input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="text-2xl font-mono tracking-widest text-center"
                  maxLength={10}
                  required
                />
                <Button type="button" variant="outline" onClick={regenerarCodigo}>
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Código único que el paciente introducirá para acceder
              </p>
            </div>

            {/* Descripción */}
            <Input
              label="Descripción (opcional)"
              placeholder="Ej: Paciente Sr. García - Lumbalgia"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            {/* Configuración */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Días hasta expiración"
                value={diasExpiracion}
                onChange={(e) => setDiasExpiracion(parseInt(e.target.value) || 30)}
                min={1}
                max={365}
              />
              <Input
                type="number"
                label="Usos máximos"
                value={usosMaximos}
                onChange={(e) => setUsosMaximos(parseInt(e.target.value) || 50)}
                min={1}
                max={1000}
              />
            </div>

            {/* Selección de paquetes */}
            <div className="space-y-3">
              <label className="text-lg font-medium">Paquetes a Asignar</label>
              <p className="text-sm text-muted-foreground">
                Selecciona los paquetes de terapia que el paciente podrá ver
              </p>
              <div className="grid gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                {paquetes.map((paquete) => (
                  <label
                    key={paquete.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      paquetesSeleccionados.includes(paquete.id)
                        ? 'bg-primary/10 border-primary border-2'
                        : 'bg-muted hover:bg-accent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={paquetesSeleccionados.includes(paquete.id)}
                      onChange={() => togglePaquete(paquete.id)}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-medium">{paquete.nombre}</p>
                      {paquete.lesion && (
                        <p className="text-sm text-muted-foreground">
                          {paquete.lesion.nombre}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
                {paquetes.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No hay paquetes disponibles
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" size="lg" disabled={loading} className="flex-1">
                {loading ? (
                  'Creando...'
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Crear Código
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" size="lg" asChild>
                <Link href="/admin/codigos">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
