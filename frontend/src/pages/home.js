
import { useState } from "react"
import EventList from "../components/EventList"
import Navcomp from "../components/Nav"
import { useEvents } from "../context/eventcontext";
import { useUser } from "../context/usercontext";

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const[searchQuery,setSearchQuery]=useState('');
  const {user} = useUser();
  const {events}=useEvents();
  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // const filteredEvents = events.filter((event) => {

  //   return(event.attendees.includes(user.id) || event.creator._id === user.id);
  // });


  return (
    <>
    <Navcomp searchQuery={searchQuery} handleSearch={handleSearch} />
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Planned Events</h1>
      <EventList events={events} onEventClick={handleEventClick} searchTerm={searchQuery}/>
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">{selectedEvent.name}</h2>
            <p>
              <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}
            </p>
            <p>
              <strong>Category:</strong> {selectedEvent.category}
            </p>
            <p>
              <strong>From:</strong> {selectedEvent.from}
            </p>
            <p className="mt-2">{selectedEvent.description}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

