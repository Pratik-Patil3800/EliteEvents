import { useState } from "react"
import EventNotification from "./EventNotification"
import CustomToggle from "./CustomToggle"
import { useUser } from "../context/usercontext"

const EventList = ({ events, onEventClick ,searchTerm}) => {
  const [showMyEvents, setShowMyEvents] = useState(false)
  const [showUpcoming, setShowUpcoming] = useState(true)
  const {user} = useUser();

  const filteredEvents = events.filter((event) => {
    const isUpcoming = new Date(event.date) > new Date()
    if (showUpcoming && !isUpcoming) return false
    if (!showUpcoming && isUpcoming) return false
    if (showMyEvents && event.creator._id !== user.id) return false
    const matchesSearch = 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch
  })

  return (
<div className="space-y-4">
<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <CustomToggle options={["All Events", "My Events"]} value={showMyEvents} onToggle={setShowMyEvents} />
        <CustomToggle
          options={["Upcoming", "Past"]}
          value={!showUpcoming}
          onToggle={(value) => setShowUpcoming(!value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredEvents.map((event) => (
          <EventNotification key={event._id} {...event} flag={false}/>
        ))}
      </div>
    </div>
  )
}

export default EventList

