import RSVP from "../models/RSVP.js";

export const getRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.findAll();
    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRSVPById = async (req, res) => {
  try {
    const rsvp = await RSVP.findByPk(req.params.id);
    if (!rsvp) return res.status(404).json({ error: "RSVP not found" });
    res.json(rsvp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createRSVP = async (req, res) => {
  try {
    const { userId, eventId, status } = req.body;
    const rsvp = await RSVP.create({ userId, eventId, status });
    res.status(201).json(rsvp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateRSVP = async (req, res) => {
  try {
    const { status } = req.body;
    const rsvp = await RSVP.findByPk(req.params.id);
    if (!rsvp) return res.status(404).json({ error: "RSVP not found" });
    await rsvp.update({ status });
    res.json(rsvp);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteRSVP = async (req, res) => {
  try {
    const rsvp = await RSVP.findByPk(req.params.id);
    if (!rsvp) return res.status(404).json({ error: "RSVP not found" });
    await rsvp.destroy();
    res.json({ message: "RSVP deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
