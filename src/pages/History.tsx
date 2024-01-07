import { useEffect, useState } from "react";
import {
  deleteVideo,
  downloadVideo,
  getHistory,
} from "../service/BackendService.ts";
import { Col, notification, Row } from "antd";
import { Container } from "react-bootstrap";
import VideoCardComponent from "../components/VideoCardComponent.tsx";
import { Link } from "react-router-dom";

export default function History() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    handleGetVideo();
  }, []);

  const handleGetVideo = () => {
    getHistory()
      .then((res) => {
        setVideos(res);
      })
      .catch((error) => console.log(error));
  };

  const handleDownloadVideo = async (processId: string) => {
    setDownloading(true);
    await downloadVideo(processId).then(() => {
      setDownloading(false);
    });
  };

  const handleDeleteVideo = async (processId: string, title: string) => {
    await deleteVideo(processId).then(() => {
      api.open({
        message: "Video deleted",
        description: (
          <div>
            <p>
              Your video '{title}' has been deleted. <br></br>
            </p>
          </div>
        ),
        duration: 10,
      });
    });

    handleGetVideo();
  };

  return (
    <>
      {contextHolder}
      <Container>
        <div className="d-flex mt-5 mb-5 flex-column justify-content-center text-center">
          <h1>History</h1>
          <p>
            Videos will be auto-deleted after 7 days. Download the ones you want
            to keep!
          </p>
        </div>
        {videos.length === 0 ? (
          <div className="d-flex flex-column justify-content-center text-center">
            <h3>No videos yet</h3>
            <p>
              <Link to={"/generate"}>Generate</Link> a video to see it here
            </p>
          </div>
        ) : (
          <Row gutter={[10, 30]} justify="center" align="middle">
            {videos.map((video: VideoData, index) => (
              <Col xs={24} sm={24} md={24} key={index}>
                <VideoCardComponent
                  video={video}
                  handleDeleteVideo={handleDeleteVideo}
                  handleDownloadVideo={handleDownloadVideo}
                  downloading={downloading}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
