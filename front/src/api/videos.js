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

async function resolveYoutubeLink(url) {
  return await instance.post("videos/youtube/resolve", { url });
}

async function setVideoEligibility(id, decision) {
  return await instance.patch(`videos/${id}/admin-eligibility`, { decision });
}

async function setPhase3Award(id, isAwarded) {
  return await instance.patch(`videos/${id}/phase3-award`, { isAwarded });
}

async function setPhase2Selection(id, isSelected) {
  return await instance.patch(`videos/${id}/phase2-selection`, { isSelected });
}

async function deleteAdminVideo(id) {
  return await instance.delete(`videos/${id}`);
}

async function getAwardedVideos() {
  return await instance.get("videos/awarded");
}

async function getAwardedGalleryStatus() {
  return await instance.get("videos/awarded-status");
}

async function setAwardedGalleryStatus(isOpen) {
  return await instance.patch("videos/awarded-status", { isOpen });
}

async function submitJuryVote(id, vote, commentary = "") {
  return await instance.post(`videos/${id}/jury-vote`, { vote, commentary });
}

export {
  getVideos,
  getPublicVideos,
  getPublicGalleryStatus,
  setPublicGalleryStatus,
  getAwardedVideos,
  getAwardedGalleryStatus,
  setAwardedGalleryStatus,
  getAdminVideos,
  getJuryVideos,
  getVideoDetail,
  submitVideo,
  uploadVideoFile,
  resolveYoutubeLink,
  setVideoEligibility,
  setPhase2Selection,
  setPhase3Award,
  deleteAdminVideo,
  submitJuryVote,
};
