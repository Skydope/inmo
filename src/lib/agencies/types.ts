export type Agency = {
  /** Slug: "norte-propiedades". */
  id: string
  name: string
  logoUrl: string
  address: string
  phone?: string
  /** Formato internacional sin "+": "5492314xxxxxx". */
  whatsapp?: string
  email?: string
  /** Matrícula: "CMCPSI 1234". */
  license?: string
}
