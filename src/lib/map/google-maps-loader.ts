let loadPromise: Promise<typeof google.maps> | null = null

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in browser environment"))
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("google-maps-script") as HTMLScriptElement | null
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.google?.maps) resolve(window.google.maps)
        else reject(new Error("Google Maps script loaded but window.google.maps not found"))
      })
      existingScript.addEventListener("error", (e) => reject(e))
      return
    }

    const script = document.createElement("script")
    script.id = "google-maps-script"
    script.type = "text/javascript"
    script.async = true
    script.defer = true

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || ""
    const keyParam = apiKey ? `key=${encodeURIComponent(apiKey)}&` : ""
    // Note: If no key is provided, Google Maps loads in development/demo mode with a subtle watermark.
    script.src = `https://maps.googleapis.com/maps/api/js?${keyParam}libraries=places,geometry&loading=async`

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps)
      } else {
        reject(new Error("Google Maps SDK failed to initialize."))
      }
    }

    script.onerror = (err) => {
      loadPromise = null
      reject(err)
    }

    document.head.appendChild(script)
  })

  return loadPromise
}
