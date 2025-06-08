import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ include: "creator" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, { include: "creator" });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      registrationStart,
      registrationEnd,
      location,
      creatorId,
      coverImage,
    } = req.body;
    const event = await Event.create({
      title,
      description,
      eventDate,
      registrationStart,
      registrationEnd,
      location,
      creatorId,
      coverImage,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      registrationStart,
      registrationEnd,
      location,
      creatorId,
      coverImage,
    } = req.body;
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.update({
      title,
      description,
      eventDate,
      registrationStart,
      registrationEnd,
      location,
      creatorId,
      coverImage,
    });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.destroy();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
