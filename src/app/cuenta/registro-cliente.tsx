"use client"

import dynamic from "next/dynamic"

/** Los íconos de Phosphor no coinciden entre el servidor y el cliente. El alta es un
 *  formulario con estado: no hace falta pintarlo en el servidor. */
export const Registro = dynamic(() => import("./registro").then((mod) => mod.Registro), {
  ssr: false,
})
