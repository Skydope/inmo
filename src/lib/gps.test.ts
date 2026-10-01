import { describe, expect, it, vi } from "vitest"
import { gpsBannerMessage, requestGps } from "@/lib/gps"

describe("requestGps", () => {
  it("returns error when geo API missing", async () => {
    const status = await requestGps(null)
    expect(status.kind).toBe("error")
  })

  it("resolves success", async () => {
    const geo = {
      getCurrentPosition: (ok: (p: { coords: { latitude: number; longitude: number } }) => void) => {
        ok({ coords: { latitude: -36.23, longitude: -61.11 } })
      },
    }
    const status = await requestGps(geo)
    expect(status).toEqual({ kind: "success", lat: -36.23, lng: -61.11 })
  })

  it("maps permission deny", async () => {
    const geo = {
      getCurrentPosition: (
        _ok: (pos: { coords: { latitude: number; longitude: number } }) => void,
        err?: (e: { code: number; message: string }) => void,
      ) => {
        err?.({ code: 1, message: "denied" })
      },
    }
    const status = await requestGps(geo)
    expect(status.kind).toBe("denied")
  })

  it("times out when geo never answers", async () => {
    vi.useFakeTimers()
    const geo = {
      getCurrentPosition: () => {
        /* hang */
      },
    }
    const promise = requestGps(geo, 100)
    await vi.advanceTimersByTimeAsync(100)
    const status = await promise
    expect(status.kind).toBe("timeout")
    vi.useRealTimers()
  })
})

describe("gpsBannerMessage", () => {
  it("returns soft copy for deny/timeout", () => {
    expect(gpsBannerMessage({ kind: "denied" })).toMatch(/Bolívar centro/)
    expect(gpsBannerMessage({ kind: "timeout" })).toMatch(/Bolívar centro/)
    expect(gpsBannerMessage({ kind: "idle" })).toBeNull()
  })
})
