import { Button, Card, Modal, Popover } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import video_placeholder from "../assets/video_placeholder.gif";
import ReactPlayer from "react-player";
import { useState } from "react";

export default function VideoCardComponent({
  video,
  handleDeleteVideo,
  handleDownloadVideo,
  downloading,
}: {
  video: VideoData;
  handleDeleteVideo: (processId: string, title: string) => void;
  handleDownloadVideo: (processId: string) => void;
  downloading: boolean;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [processID, setProcessID] = useState("");
  const [title, setTitle] = useState("");

  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleDeleteClick = (processId: string, title: string) => {
    setShowDeleteModal(true);
    setProcessID(processId);
    setTitle(title);
  };

  const handleDelete = () => {
    handleDeleteVideo(processID, title);
    setShowDeleteModal(false);
  };

  const failedError = (error: string) => {
    return (
      <div>
        <p className="error">{error}</p>
        <p>
          If this message isn't useful please get in contact at <br></br>
          <a href="contact@ai-content-generator.com">
            contact@ai-content-generator.com
          </a>
        </p>
      </div>
    );
  };
  return (
    <>
      <Card>
        <Container fluid>
          <Row className="d-flex flex-row">
            <Col xs={12} sm={6}>
              {video.video.fileUrl ? (
                <div
                  className="d-flex p-2 text-center justify-content-center"
                  style={{ height: "100%" }}
                >
                  <ReactPlayer
                    url={video.video.fileUrl}
                    width="100%"
                    maxheight="250px"
                    controls
                  />
                </div>
              ) : (
                <div
                  className="d-flex p-2 text-center justify-content-center"
                  style={{ height: "100%" }}
                >
                  <img
                    alt="example"
                    src={video_placeholder}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Col>
            <Col className="video-card-desc">
              {video.state === "COMPLETED" ? (
                <>
                  <h5>{video.title}</h5>
                  <p>
                    <b>Length: </b>
                    {` ${video.video.length} seconds`}
                  </p>
                  <p>
                    <b>Created: </b>
                    {` ${formatDate(video.video.created)}`}
                  </p>
                  <p>
                    <b>Uploaded: </b>
                    {` ${formatDate(video.video.uploadDate)}`}
                  </p>
                  <br />
                  <Button
                    type="primary"
                    loading={downloading}
                    onClick={() => handleDownloadVideo(video.video.videoId)}
                  >
                    Download
                  </Button>
                </>
              ) : video.state === "FAILED" ? (
                <>
                  <h5>{video.title}</h5>
                  <p>{`Created: ${formatDate(video.video.created)}`}</p>
                  <br />

                  <Popover
                    content={failedError(video.error)}
                    title="Video Generation Failed"
                  >
                    <Button danger>Failed - Click to see why</Button>
                  </Popover>
                </>
              ) : (
                <>
                  <h5>{video.title}</h5>
                  <p>{`Your video is ${video.state.toLowerCase()}.`}</p>
                  <p>Please come back in a few minutes to see your video.</p>
                  <br />

                  <Button type="primary" loading={true}>
                    {video.state.charAt(0).toUpperCase() +
                      video.state.slice(1).toLowerCase()}
                  </Button>
                </>
              )}
              <div className="mt-3">
                <Button
                  type="primary"
                  danger
                  disabled={video.state === "PROCESSING"}
                  onClick={() =>
                    handleDeleteClick(video.video.videoId, video.title)
                  }
                >
                  Delete
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Card>
      <Modal
        title="Are you sure you want to delete this video?"
        centered
        open={showDeleteModal}
        onOk={() => handleDelete()}
        onCancel={() => setShowDeleteModal(false)}
      >
        <p>
          This action is irreversible.
          <br />
          Are you sure?
        </p>
      </Modal>{" "}
    </>
  );
}
