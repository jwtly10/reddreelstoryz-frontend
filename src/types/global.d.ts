declare type Video = {
  videoId: string;
  fileName: string;
  fileUrl: string;
  length: int;
  state: string;
  uploadDate: string;
  created: string;
};

declare type VideoData = {
  video: Video;
  title: string;
  state: string;
  error: string;
  userId: number;
};

declare type ManualGenRequest = {
  title: string;
  subreddit: string;
  content: string;
  backgroundVideo: string;
};

declare type RedditRequest = {
  url: string;
  backgroundVideo: string;
};
