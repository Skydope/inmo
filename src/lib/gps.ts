export type GpsStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success"; lat: number; lng: number }
  | { kind: "denied" }
  | { kind: "timeout" }
  | { kind: "error"; message: string }

export const GPS_TIMEOUT_MS = 8000

type GeoLike = {
  getCurrentPosition: (
    success: (pos: { coords: { latitude: number; longitude: number } }) => void,
    error?: (err: { code: number; message: string }) => void,
    options?: { timeout?: number; enableHighAccuracy?: boolean },
  ) => void
}

/** Promise wrapper around geolocation with deny / timeout / fallback paths. */
export function requestGps(
  geo: GeoLike | null | undefined,
  timeoutMs = GPS_TIMEOUT_MS,
): Promise<GpsStatus> {
  if (!geo) {
    return Promise.resolve({ kind: "error", message: "Geolocalización no disponible" })
  }

  return new Promise((resolve) => {
    let settled = false
    const finish = (status: GpsStatus) => {
      if (settled) return
      settled = true
      resolve(status)
    }

    const timer = setTimeout(() => finish({ kind: "timeout" }), timeoutMs)

    try {
      geo.getCurrentPosition(
        (pos) => {
          clearTimeout(timer)
          finish({
            kind: "success",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        (err) => {
          clearTimeout(timer)
          // 1 = PERMISSION_DENIED
          if (err.code === 1) finish({ kind: "denied" })
          else if (err.code === 3) finish({ kind: "timeout" })
          else finish({ kind: "error", message: err.message || "Error de GPS" })
        },
        { enableHighAccuracy: true, timeout: timeoutMs },
      )
    } catch {
      clearTimeout(timer)
      finish({ kind: "error", message: "Geolocalización no disponible" })
    }
  })
}

export function gpsBannerMessage(status: GpsStatus): string | null {
  switch (status.kind) {
    case "denied":
      return "No pudimos usar tu ubicación. Mostramos Bolívar centro."
    case "timeout":
      return "La ubicación tardó demasiado. Mostramos Bolívar centro."
    case "error":
      return "No pudimos obtener tu ubicación. Mostramos Bolívar centro."
    default:
      return null
  }
}
