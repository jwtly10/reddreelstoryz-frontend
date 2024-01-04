import axios from 'axios';
import AuthError from "./exceptions/AuthError.ts";

const apiBaseUrl = import.meta.env.VITE_SERVER_URL as string;

async function getHistory() : Promise<VideoData[]>{
    try {
        let videos: VideoData[] = []
        const response = await axios.get(`${apiBaseUrl}/api/v1/video/getVideos`)
        videos = response.data.videos
        console.log(videos)
        return videos
    } catch (error) {
        if (error instanceof AuthError) {
            console.log(error.message)
        } else {
            console.log("Error fetching history: " + error)
        }
    }

    return [];
}

async function downloadVideo(processId : string){
    try {
        const response = await axios.get(`${apiBaseUrl}/api/v1/video/download/${processId}`)

        const blob = new Blob([response.data], {type: 'video/mp4'});

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${processId}-ai-content-generator.mp4`;
        a.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading video:', error);
    }
};


export { getHistory, downloadVideo};
