  const Event = require('../models/Event');
  const clodinary = require('cloudinary').v2;
  
  exports.createEvent = async (req, res) => {
    try {
      let imageUrl = '';
  
      if (req.file) {
        
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await clodinary.uploader.upload(dataURI, {
          resource_type: 'auto'
        });
        imageUrl = result.secure_url;
      }
      console.log(req.body);
      const event = new Event({
        ...req.body,
        creator: req.user._id,
        imageUrl,
      });
      
      await event.save();
      console.log(event);
  
      req.app.get('io').emit('newEvent', event);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getEvents = async (req, res) => {
    try {
      const events = await Event.find().populate('creator', '_id name');

      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.getEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
        .populate('creator', 'name')
        .populate('attendees', 'name');

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateEvent = async (req, res) => {
    try {
      const eventId = req.params.id;
      const { name, description, date, time, category, urgency } = req.body;
      console.log(req.body.name);
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      if (name) event.name = name;
      if (description) event.description = description;
      if (date) event.date = date;
      if (time) event.time = time;
      if (category) event.category = category;
      if (urgency) event.urgency = urgency;
  
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        const result = await clodinary.uploader.upload(dataURI, {
          resource_type: "auto",
        });
        event.imageUrl = result.secure_url;
      }
  
      await event.save();
      req.app.get('io').emit('updateEvent', event);
      res.json(event);
    } catch (error) {
      console.error("Event update error:", error);
      res.status(400).json({ error: error.message });
    }
  };
  
  
  
 

  exports.deleteEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      if(event.creator.toString() === req.user._id.toString()){
        await Event.findByIdAndDelete(req.params.id);
        // console.log('hi')
        req.app.get('io').emit('deleteEvent', req.params.id);
        return res.json({ message: 'Event deleted successfully' });
      }
      else{
        //check in attendees , if user remove from attendees
        const index = event.attendees.indexOf(req.user._id);
        if(index > -1){
          event.attendees.splice(index, 1);
          await event.save();
          req.app.get('io').emit('attendeeLeft', { 
            eventId: event._id,
            attendee: req.user._id
          });
          res.json(event);
        }
        else{
          return res.status(403).json({ error: 'Unauthorized' });
        }
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };

  exports.joinEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.attendees.includes(req.user._id)) {
        return res.status(400).json({ error: 'Already joined this event' });
      }

      event.attendees.push(req.user._id);
      await event.save();

      req.app.get('io').emit('attendeeJoined', {
        eventId: event._id,
        attendee: req.user._id
      });
      console.log('hi')
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
