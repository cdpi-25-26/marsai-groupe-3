import instance from "./config.js";

async function getVideos() {
  return await instance.get("videos");
}

async function getPublicVideos() {
  return await instance.get("videos");
}

async function getPublicGalleryStatus() {
  return await instance.get("videos/public-status");
}

async function setPublicGalleryStatus(isOpen) {
  return await instance.patch("videos/public-status", { isOpen });
}

async function getAdminVideos() {
  return await instance.get("videos/admin");
}

async function getJuryVideos() {
  return await instance.get("videos/jury");
}

async function getVideoDetail(id) {
  return await instance.get(`videos/${id}`);
}

async function submitVideo(videoData) {
  return await instance.post("videos/submit", videoData);
}

async function uploadVideoFile(file) {
  const formData = new FormData();
  formData.append("video", file);

  return await instance.post("videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

async function setVideoEligibility(id, decision) {
  return await instance.patch(`videos/${id}/admin-eligibility`, { decision });
}

async function setPhase3Award(id, isAwarded) {
  return await instance.patch(`videos/${id}/phase3-award`, { isAwarded });
}

async function deleteAdminVideo(id) {
  return await instance.delete(`videos/${id}`);
}

async function submitJuryVote(id, vote, commentary = "") {
  return await instance.post(`videos/${id}/jury-vote`, { vote, commentary });
}

export {
  getVideos,
  getPublicVideos,
  getPublicGalleryStatus,
  setPublicGalleryStatus,
  getAdminVideos,
  getJuryVideos,
  getVideoDetail,
  submitVideo,
  uploadVideoFile,
  setVideoEligibility,
  setPhase3Award,
  deleteAdminVideo,
  submitJuryVote,
};
