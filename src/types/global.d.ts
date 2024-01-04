declare type Video = {
        videoId: string,
        fileName: string,
        fileUrl: string,
        length: int,
        state: string,
        uploadDate: string
}

declare type VideoData = {
        video: Video,
        state: string,
        error: string,
        userId: number
}