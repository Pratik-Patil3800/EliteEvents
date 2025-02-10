export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// export type EventType = {
//   id: string
//   title: string
//   date: Date
//   type: "help-needed" | "needs-met" | "occasion"
//   urgency?: "low" | "medium" | "high"
// }

