import { Users } from "../models/index.js";
import { Videos } from "../models/index.js";
import { hashPassword } from "./password.js";

await Videos.create({
  title: "Video1",
  description: "This is a sample video description.",
  url: "https://example.com/sample-video.mp4",
  thumbnailUrl: "https://example.com/sample-thumbnail.jpg",
  duration: 120,
  id_user: 1
});