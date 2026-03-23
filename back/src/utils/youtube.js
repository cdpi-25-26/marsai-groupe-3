const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function parseIso8601DurationToSeconds(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const matches = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) {
    return null;
  }

  const hours = Number.parseInt(matches[1] || "0", 10);
  const minutes = Number.parseInt(matches[2] || "0", 10);
  const seconds = Number.parseInt(matches[3] || "0", 10);
  return (hours * 3600) + (minutes * 60) + seconds;
}

function extractYouTubeVideoId(input) {
  if (!input || typeof input !== "string") {
    return null;
  }

  const trimmedInput = input.trim();

  if (YOUTUBE_ID_REGEX.test(trimmedInput)) {
    return trimmedInput;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmedInput);
  } catch {
    return null;
  }

  const host = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = parsedUrl.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsedUrl.pathname === "/watch") {
      const id = parsedUrl.searchParams.get("v") || "";
      return YOUTUBE_ID_REGEX.test(id) ? id : null;
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      const id = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || "";
      return YOUTUBE_ID_REGEX.test(id) ? id : null;
    }

    if (parsedUrl.pathname.startsWith("/shorts/")) {
      const id = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      return YOUTUBE_ID_REGEX.test(id) ? id : null;
    }
  }

  return null;
}

async function fetchYouTubeOEmbed(canonicalUrl) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error("Lien YouTube invalide ou inaccessible");
  }

  const payload = await response.json();

  return {
    title: payload.title || null,
    thumbnail: payload.thumbnail_url || null,
    channelTitle: payload.author_name || null,
  };
}

async function fetchYouTubeApiDetails(videoId) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return null;
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const item = payload?.items?.[0];
  if (!item) {
    return null;
  }

  return {
    title: item?.snippet?.title || null,
    thumbnail:
      item?.snippet?.thumbnails?.maxres?.url
      || item?.snippet?.thumbnails?.standard?.url
      || item?.snippet?.thumbnails?.high?.url
      || item?.snippet?.thumbnails?.medium?.url
      || item?.snippet?.thumbnails?.default?.url
      || null,
    channelTitle: item?.snippet?.channelTitle || null,
    durationSeconds: parseIso8601DurationToSeconds(item?.contentDetails?.duration),
    privacyStatus: item?.status?.privacyStatus || null,
    embeddable: typeof item?.status?.embeddable === "boolean" ? item.status.embeddable : null,
  };
}

async function resolveYouTubeVideo(input) {
  const videoId = extractYouTubeVideoId(input);

  if (!videoId) {
    const error = new Error("Lien YouTube invalide");
    error.statusCode = 400;
    throw error;
  }

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const [oEmbedData, apiData] = await Promise.all([
    fetchYouTubeOEmbed(canonicalUrl),
    fetchYouTubeApiDetails(videoId),
  ]);

  return {
    videoId,
    canonicalUrl,
    title: apiData?.title || oEmbedData.title,
    thumbnail: apiData?.thumbnail || oEmbedData.thumbnail,
    channelTitle: apiData?.channelTitle || oEmbedData.channelTitle,
    durationSeconds: apiData?.durationSeconds || null,
    privacyStatus: apiData?.privacyStatus || null,
    embeddable: apiData?.embeddable,
    source: apiData ? "youtube-data-api" : "youtube-oembed",
  };
}

export { extractYouTubeVideoId, resolveYouTubeVideo };