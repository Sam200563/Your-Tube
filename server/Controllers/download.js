import Download from "../Models/downloadvideo.js";
import User from "../Models/user.js";


export const downloadcontroller = async (req, res) => {
  try {
    const { videoid, viewer } = req.body;

    if (!videoid || !viewer) {
      return res.status(400).json({ message: "Missing videoid or viewer" });
    }

    const user = await User.findById(viewer);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const alreadyDownloaded = await Download.findOne({
      viewer,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (!user.isPremium && alreadyDownloaded) {
      return res.status(403).json({ message: "Daily download limit reached. Please upgrade to premium." });
    }

    const newDownload = new Download({ videoid, viewer });
    await newDownload.save();

    res.status(200).json({ message: "Download allowed" });
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getalldownloadcontroller = async (req, res) => {
  try {
    const downloads = await Download.find();
    res.status(200).json(downloads);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deletedownload = async (req, res) => {
  const { videoid, viewer } = req.params;
  try {
    const deleted = await Download.findOneAndDelete({ videoid, viewer });
    if (!deleted) {
      return res.status(404).json({ message: "Download not found" });
    }
    res.status(200).json({ message: "Removed from downloads" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
