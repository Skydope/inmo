import { defineConfig, devices } from "@playwright/test"

// Puerto propio, distinto del de `pnpm dev` (43123), para no pisar el server de
// desarrollo (regla heredada de Club del Cóctel).
const PUERTO = 43124
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PUERTO}`

/** Specs que se corren también con JavaScript apagado. */
const SIN_JS = /sin-js\.spec\.ts/

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: BASE_URL, trace: "on-first-retry" },
  projects: [
    // Mobile primero: un Android chico, el alto que deja el navegador de Instagram.
    {
      name: "android-chico",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 360, height: 640 },
      },
      testIgnore: SIN_JS,
    },
    { name: "iphone", use: { ...devices["iPhone 13"] }, testIgnore: SIN_JS },
    { name: "escritorio", use: { ...devices["Desktop Chrome"] }, testIgnore: SIN_JS },
    // Lo que tiene que andar aunque el JS no cargue (buscador, contacto).
    {
      name: "sin-js",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 360, height: 640 },
        javaScriptEnabled: false,
      },
      testMatch: SIN_JS,
    },
  ],
  webServer: {
    command: `pnpm next dev -p ${PUERTO}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
