import Users from "../models/Users.js";
import Videos from "../models/Videos.js";
import Video_Jury from "../models/Video_Jury.js";



export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password"] }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await Users.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   VIDEOS
===================================================== */


export const getAllVideos = async (req, res) => {
  try {
    const videos = await Videos.findAll();
    res.json(videos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getVideoById = async (req, res) => {
  try {
    const video = await Videos.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteVideo = async (req, res) => {
  try {
    const video = await Videos.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await video.destroy();

    res.json({ message: "Video deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* =====================================================
   ASSIGNATIONS
===================================================== */


export const assignVideoToJury = async (req, res) => {
  try {
    const { id_video, id_user } = req.body;


    const jury = await Users.findByPk(id_user);

    if (!jury || jury.role !== "JURY") {
      return res.status(400).json({
        message: "User is not a jury"
      });
    }


    const video = await Videos.findByPk(id_video);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    // Prevent duplicate assign
    const existing = await Video_Jury.findOne({
      where: { id_video, id_user }
    });

    if (existing) {
      return res.status(400).json({
        message: "Already assigned"
      });
    }

    const assign = await Video_Jury.create({
      id_video,
      id_user
    });

    res.json(assign);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const removeVideoFromJury = async (req, res) => {
  try {
    const { id_video, id_user } = req.body;

    const deleted = await Video_Jury.destroy({
      where: { id_video, id_user }
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Assignation not found"
      });
    }

    res.json({ message: "Assignation removed" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getJuryVideos = async (req, res) => {
  try {
    const { id_user } = req.params;

    const assignations = await Video_Jury.findAll({
      where: { id_user }
    });

    res.json(assignations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getVideoJurys = async (req, res) => {
  try {
    const { id_video } = req.params;

    const assignations = await Video_Jury.findAll({
      where: { id_video }
    });

    res.json(assignations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
