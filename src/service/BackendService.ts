import axios from "axios";
import GenerationError from "../exceptions/GenerationError.ts";

const apiBaseUrl = import.meta.env.VITE_SERVER_URL as string;

async function generateFromRedditURL(req: RedditRequest): Promise<string> {
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
    console.log(req);
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

// function getAvailableBackgroundVideos(): string[] {
//   return ["TODO"];
// }

function handleGenerationError(error: any) {
  const errorResponse = error.response.data as { error: string } | undefined;
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
};
