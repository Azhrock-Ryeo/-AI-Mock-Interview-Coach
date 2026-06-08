type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | undefined | null>

export function cn(...classes: ClassValue[]) {
  return classes
    .flatMap((value) => {
      if (typeof value === "string" || typeof value === "number") {
        return [String(value)]
      }
      if (Array.isArray(value)) {
        return value
      }
      if (typeof value === "object" && value !== null) {
        return Object.entries(value)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([className]) => className)
      }
      return []
    })
    .filter(Boolean)
    .join(" ")
}
