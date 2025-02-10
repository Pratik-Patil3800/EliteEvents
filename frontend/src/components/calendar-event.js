
const eventStyles = {
  "high": "bg-red-100 border-l-4 border-red-500",
  "medium": "bg-blue-100 border-l-4 border-blue-500",
  "low": "bg-yellow-100 border-l-4 border-yellow-500",
}
const formatTime = (timeString) => {
  if (!timeString) return "Invalid Time";
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
  });
};

export function CalendarEvent({ event }) {
  return <div className={`p-1 text-xs rounded ${eventStyles[event.urgency]}`}>{event.name}, {formatTime(event.time)}</div>
}

