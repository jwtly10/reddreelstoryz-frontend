import axios from "axios";
import GenerationError from "../exceptions/GenerationError.ts";
import debug from "../utils/debug.ts";

const apiBaseUrl = import.meta.env.VITE_SERVER_URL as string;

axios.defaults.headers.post["Content-Type"] = "application/json";

async function generateFromRedditURL(req: RedditRequest): Promise<string> {
  debug("Generating video from redditURL");
  try {
    const response = await axios.post(
      `${apiBaseUrl}/api/v1/video/generate/reddit`,
      {
        url: req.url,
        backgroundVideo: req.backgroundVideo,
      },
    );
    debug(response)
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
    debug("Generating video from custom script");
    const response = await axios.post(`${apiBaseUrl}/api/v1/video/generate`, {
      title: req.title,
      subreddit: req.subreddit,
      content: req.content,
      backgroundVideo: req.backgroundVideo,
    });
    debug(response)
    return response.data.processId;
  } catch (error: any) {
    handleGenerationError(error);
    throw error;
  }
}

function handleGenerationError(error: any) {
  const errorResponse = error.response.data as { error: string } | undefined;
  debug(error);
  if (errorResponse) {
    const errorMessage = errorResponse.error;
    debug(`Generation failed: ${errorMessage}}`);
    throw new GenerationError(errorMessage);
  } else {
    debug(`Generation failed: Unknown Error`);
    throw new Error("Unknown Error");
  }
}

async function getHistory(): Promise<VideoData[]> {
  try {
    let videos: VideoData[] = [];
    const response = await axios.get(`${apiBaseUrl}/api/v1/video/getVideos`);
    videos = response.data.videos;
    debug(videos);
    return videos;
  } catch (error) {
    // handle error
    console.error("Error fetching history: " + error);
  }

  return [];
}

async function deleteVideo(processId: string) {
  try {
    debug("Deleting video");
    const response = await axios.delete(
      `${apiBaseUrl}/api/v1/video/delete/${processId}`,
    );
    debug(response);
  } catch (error) {
    console.error("Error deleting video:", error);
  }
}

async function downloadVideo(processId: string) {
  try {
    debug("Downloading video");
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


async function subscribe(email: string){
  try {
        debug("Subscribing email");
        const response = await axios.post(
        `${apiBaseUrl}/api/v1/newsletter/subscribe`,
        { email },
        );
        debug(response);
        return response;
    } catch (error) {
        console.error("Error subscribing email:", error);
        return error;
    }
}

export {
  getHistory,
  downloadVideo,
  generateFromRedditURL,
  generateFromCustomScript,
  deleteVideo,
  subscribe
};
