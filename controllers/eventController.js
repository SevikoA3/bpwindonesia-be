import Event from "../models/Event.js";
import cloudinary from "../util/cloudinary.js";
import streamifier from "streamifier";

async function streamUpload(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ include: "eventCreator" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, { include: "eventCreator" });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, subTitle, description, date, time, location, registrationStart, registrationEnd, creatorId } =
      req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Cover image is required" });
    }
    const uploadResult = await streamUpload(req.file.buffer, {
      folder: "event_covers",
      unique_filename: true,
      overwrite: true,
    });
    const coverImage = uploadResult.secure_url;
    const event = await Event.create({
      title,
      subTitle,
      description,
      date,
      time,
      location,
      registrationStart,
      registrationEnd,
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
    const { title, subTitle, description, date, time, location, registrationStart, registrationEnd, creatorId } =
      req.body;
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    let coverImage = event.coverImage;
    if (req.file) {
      // Delete old cover from Cloudinary if exists
      if (coverImage) {
        try {
          const urlParts = coverImage.split("/");
          const fileName = urlParts[urlParts.length - 1];
          const publicId = fileName.split(".")[0];
          await cloudinary.uploader.destroy(`event_covers/${publicId}`);
        } catch (cloudErr) {
          console.error("Cloudinary deletion error:", cloudErr);
        }
      }
      const uploadResult = await streamUpload(req.file.buffer, {
        folder: "event_covers",
        unique_filename: true,
        overwrite: true,
      });
      coverImage = uploadResult.secure_url;
    }
    await event.update({
      title,
      subTitle,
      description,
      date,
      time,
      location,
      registrationStart,
      registrationEnd,
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
    // Delete cover image from Cloudinary if exists
    if (event.coverImage) {
      try {
        const urlParts = event.coverImage.split("/");
        const fileName = urlParts[urlParts.length - 1];
        const publicId = fileName.split(".")[0];
        await cloudinary.uploader.destroy(`event_covers/${publicId}`);
      } catch (cloudErr) {
        console.error("Cloudinary deletion error:", cloudErr);
      }
    }
    await event.destroy();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
