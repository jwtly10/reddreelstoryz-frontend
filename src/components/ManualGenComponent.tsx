import { useState } from "react";
import { Button, Form, Input, notification, Select } from "antd";
import { generateFromCustomScript } from "../service/BackendService.ts";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";

export default function ManualGenComponent() {
  const [title, setTitle] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const bgOptions = ["Minecraft Parkour", "Mirrors Edge"];
  const [loading, setLoading] = useState(false);

  const handleGeneration = (values: any) => {
    setLoading(true);
    console.log("Values" + values);
    // Build request body
    const req: ManualGenRequest = {
      title: values.title,
      subreddit: values.subreddit,
      content: values.content,
      backgroundVideo: values.backgroundVideo,
    };
    // Clear error
    setError("");
    generateFromCustomScript(req)
      .then((res) => {
        handleQueuedVideo(res);
        setError("");
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleQueuedVideo = (res: any) => {
    api.open({
      message: "Video generation queued",
      description: (
        <div>
          <p
            style={{
              fontStyle: "italic",
              color: "DimGrey",
            }}
          >{`ProcessID: ${res}`}</p>
          <p>
            Your video is now in the queue to be process. This can take a few
            minutes. You can check the status of your video{" "}
            <Link to="/history">here</Link>.
            <br />
            <br />
            Or you can go ahead and generate another video :)
          </p>
        </div>
      ),
      duration: 10,
    });
  };

  return (
    <>
      {contextHolder}
      <Container className="d-flex mt-5 mb-5 flex-column justify-content-center text-center">
        <Form
          layout="vertical"
          name="custom-generation-form"
          onFinish={handleGeneration}
          onFinishFailed={() => {}}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Subreddit"
            name="subreddit"
            rules={[{ required: true, message: "Please enter a subreddit" }]}
          >
            <Input
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter video content" }]}
          >
            <TextArea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Background Video"
            name="backgroundVideo"
            rules={[
              { required: true, message: "Please select a background video" },
            ]}
          >
            <Select placeholder="Select a background video" allowClear>
              {bgOptions.map((bg, index) => (
                <Select.Option key={index} value={bg}>
                  {bg}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Generate video
            </Button>
          </Form.Item>
        </Form>

        <p className="error m-3">{error}</p>
      </Container>
    </>
  );
}
