import axios from "axios"
import { Bell, Calendar,Edit} from "lucide-react"
import toast from "react-hot-toast"
import { useUser } from "../context/usercontext"
import { useState } from "react"
import { useEvents } from "../context/eventcontext"
import {EventForm} from "./updateevent"

const EventNotification = ({
  _id,
  imageUrl,
  date,
  name,
  description,
  category,
  time,
  creator,
  attendees,
  urgency,
  flag
}) => {

  const { token,user } = useUser();
  const {setEvents, setunsubevents,events, unsubevents} = useEvents();
  const [open, onOpenChange] = useState(false);
  // const [isAttending, setIsAttending] = useState(attendees.includes(user.id));
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
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

  const AddToCalendar = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/events/${_id}/join`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          toast.success('Added to calendar');
          // setIsAttending(true);
          const addedEvent = unsubevents.find(event => event._id === _id);
          if (addedEvent) {
            setEvents([...events, { ...addedEvent, attendees: [...addedEvent.attendees, user.id] }]);
            setunsubevents(unsubevents.filter(event => event._id !== _id));
          }
          console.log('Added to calendar:', response.data);
        }
        catch (error) {
          toast.success('something went wrong');
          console.error('Error adding to calendar:', error);
        }
      };
  const removecalander = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URI}/api/events/${_id}`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('removed from calendar');
      // setIsAttending(true);
      const removedEvent = events.find(event => event._id === _id);
      if (removedEvent) {
        setunsubevents([...unsubevents, { ...removedEvent, attendees: removedEvent.attendees.filter(id => id !== user.id) }]);
        setEvents(events.filter(event => event._id !== _id));
      }
      console.log('Added to calendar:', response.data);
    }
    catch (error) {
      
      toast.error('something went wrong');
      console.error('Error adding to calendar:', error);
    }
  };

  return (
    
    <div className="w-full h-max-fit bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col p-4">
      <div className="relative h-48 flex-shrink-0">
        <img
          src={imageUrl || "/api/placeholder/400/200"}
          alt={name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 right-4 px-3 py-1 text-sm bg-white/90 text-black rounded-full">
          {category}
        </span>
      </div>
      
      <div className="p-4 flex-grow flex flex-col bg-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <Bell className="w-4 h-4 mr-1 flex-shrink-0" />
              From: {creator.name}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-gray-700 flex">
              {formatDate(date)}, {formatTime(time)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {attendees.length} {attendees.length === 1 ? "attendee" : "attendees"}
            </p>
          </div>
        </div>
        
        <p className="text-gray-600 mt-2 line-clamp-3">
          {description}
        </p>
      </div>

      <div className="px-4 pt-3 border-t border-gray-100 flex justify-end mt-auto">
        {flag ?(<button
          onClick={AddToCalendar}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
         
        >
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </button>):
        creator._id === user.id ? 
        (
          <div className="flex gap-2 ">
              <button
            onClick={()=>onOpenChange(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
          
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={removecalander}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
          
          >
            <Calendar className="w-4 h-4" />
            Delete Event
          </button>
          </div>
        
        ):
        (
          <button
          onClick={removecalander}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
         
        >
          <Calendar className="w-4 h-4" />
          Remove from Calendar
        </button>
        )}
      </div>
      <EventForm open={open} onOpenChange={onOpenChange} event={{ _id, imageUrl, date, name, description, category, time, creator, attendees, urgency }}/>
    </div>
  )
}

export default EventNotification

