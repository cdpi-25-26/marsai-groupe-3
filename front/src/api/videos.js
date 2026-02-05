import instance from "./config.js";

async function getVideos() {
  return await instance.get("videos");
}

async function submitVideo(videoData) {
  return await instance.post("videos/submit", videoData);
}

export { getVideos, submitVideo };
