import { ForceDark } from "@/components/force-dark"
import { SiteNav } from "@/components/site-nav"

export default function PropiedadesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ForceDark>
      <SiteNav />
      {children}
    </ForceDark>
  )
}
