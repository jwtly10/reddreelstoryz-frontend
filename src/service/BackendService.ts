import axios from "axios";
import GenerationError from "../exceptions/GenerationError.ts";

const apiBaseUrl = import.meta.env.VITE_SERVER_URL as string;

async function generateFromRedditURL(req: RedditRequest): Promise<string> {
  console.log("Generating video from redditURL");
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/v1/video/generate/reddit`,
      {
        url: req.url,
        backgroundVideo: req.backgroundVideo,
      },
    );
    return response.data.processId;
  } catch (error: any) {
    handleGenerationError(error);
    throw error;
  }
}

async function generateFromCustomScript(
  req: ManualGenRequest,
): Promise<string> {
  try {
    console.log("Generating video from custom script");
    req.backgroundVideo = "TODO";
    const response = await axios.post(`${apiBaseUrl}/api/v1/video/generate`, {
      title: req.title,
      subreddit: req.subreddit,
      content: req.content,
      backgroundVideo: req.backgroundVideo,
    });
    return response.data.processId;
  } catch (error: any) {
    handleGenerationError(error);
    throw error;
  }
}

function handleGenerationError(error: any) {
  const errorResponse = error.response.data as { error: string } | undefined;
  console.log(error);
  if (errorResponse) {
    const errorMessage = errorResponse.error;
    console.log(`Generation failed: ${errorMessage}}`);
    throw new GenerationError(errorMessage);
  } else {
    console.log(`Generation failed: Unknown Error`);
    throw new Error("Unknown Error");
  }
}

async function getHistory(): Promise<VideoData[]> {
  try {
    let videos: VideoData[] = [];
    const response = await axios.get(`${apiBaseUrl}/api/v1/video/getVideos`);
    videos = response.data.videos;
    console.log(videos);
    return videos;
  } catch (error) {
    // handle error
    console.log("Error fetching history: " + error);
  }

  return [];
}

async function deleteVideo(processId: string) {
  try {
    console.log("Deleting video");
    const response = await axios.delete(
      `${apiBaseUrl}/api/v1/video/delete/${processId}`,
    );
    console.log(response);
  } catch (error) {
    console.error("Error deleting video:", error);
  }
}

async function downloadVideo(processId: string) {
  try {
    console.log("Downloading video");
    const response = await axios.get(
      `${apiBaseUrl}/api/v1/video/download/${processId}`,
      { responseType: "blob" }, // Specify responseType as 'blob'
    );

    const blob = new Blob([response.data], { type: "video/mp4" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${processId}-ai-content-generator.mp4`;
    a.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading video:", error);
  }
}

export {
  getHistory,
  downloadVideo,
  generateFromRedditURL,
  generateFromCustomScript,
  deleteVideo,
};
