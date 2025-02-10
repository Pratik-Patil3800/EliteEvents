import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "./usercontext";
import { io } from "socket.io-client";

const EventContext = createContext();


export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [unsubevents, setunsubevents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } =useUser();
  const socket = io(process.env.REACT_APP_BACKEND_URI);
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/events`);
      console.log(user)
      const joinedevent = response.data.filter((event) => {

        return(event.attendees.includes(user.id) || event.creator._id === user?.id);
      });
      console.log(joinedevent);
      const notjoinedevent = response.data.filter((event) => {

        return !(event.attendees.includes(user.id) || event.creator._id === user?.id);
      });

      setEvents(joinedevent); 
      setunsubevents(notjoinedevent);
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!user) return;   

    socket.emit("join", user._id); 

    
    socket.on('attendeeJoined', (data) => {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === data.eventId
            ? { ...event, attendees: [...event.attendees, data.attendee] }
            : event
        )
      );
      setunsubevents(prevEvents =>
        prevEvents.map(event =>
          event._id === data.eventId
            ? { ...event, attendees: [...event.attendees, data.attendee] }
            : event
        )
      );
    });

    
    socket.on('attendeeLeft', (data) => {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === data.eventId
            ? { ...event, attendees: event.attendees.filter(attendee => attendee !== data.attendee) }
            : event
        )
      );
      setunsubevents(prevEvents =>
        prevEvents.map(event =>
          event._id === data.eventId
            ? { ...event, attendees: event.attendees.filter(attendee => attendee !== data.attendee) }
            : event
        )
      );
    });

    socket.on('newEvent', (event) => {
      const isJoinedEvent = events.some(existingEvent => existingEvent._id === event._id);

      if (!isJoinedEvent) {
        setunsubevents(prevUnsubevents => [...prevUnsubevents, event]);
      }
    });

  
    socket.on('updateEvent', (event) => {
      setEvents(prevEvents =>
        prevEvents.map(prevEvent =>
          prevEvent._id === event._id ? { ...prevEvent, ...event } : prevEvent
        )
      );
      setunsubevents(prevEvents =>
        prevEvents.map(prevEvent =>
          prevEvent._id === event._id ? { ...prevEvent, ...event } : prevEvent
        )
      );
    });
    socket.on('deleteEvent', (eventId) => {
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
    
      setunsubevents(prevUnsubevents => prevUnsubevents.filter(event => event._id !== eventId));
    });
    

    
    return () => {
      socket.off('attendeeJoined');
      socket.off('attendeeLeft');
      socket.off('newEvent');
      socket.off('updateEvent');
      socket.emit("leave", user._id); 
    };
  }, [user]);

  

  
  useEffect(() => {
    fetchEvents();
  }, [user]);

  return (
    <EventContext.Provider value={{ events,unsubevents, fetchEvents, loading ,setEvents, setunsubevents }}>
      {children}
    </EventContext.Provider>
  );
};


