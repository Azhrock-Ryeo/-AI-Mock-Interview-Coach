import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  )

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return isMobile
}
