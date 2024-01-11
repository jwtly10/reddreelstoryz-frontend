import { Container, Navbar, NavItem } from "react-bootstrap";
import { Button, Card, Form, Input } from "antd";
import { Footer } from "antd/es/layout/layout";
import landing_page_video from "../assets/landing_page_video.mp4";
import { subscribe } from "../service/BackendService.ts";
import { useState } from "react";
import debug from "../utils/debug.ts";
import ReactPlayer from "react-player";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (values: any) => {
    setError(false);
    setResponse("");
    debug(values);
    setLoading(true);
    subscribe(values.email).then((res: any) => {
      if (res.response === undefined) {
        if (res.status) {
          if (res.status === 200) {
            setResponse("Thanks for subscribing!");
            setLoading(false);
            return;
          }
        }
      } else {
        if (res.response.status !== 200) {
          setError(true);
          setResponse(res.response.data);
          setLoading(false);
          return;
        } else {
          setResponse(res.response.data);
          setLoading(false);
          return;
        }
      }
    });
  };

  return (
    <>
      <div
        className="d-flex flex-column landing"
        style={{ minHeight: "100vh" }}
      >
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="dark"
          variant="dark"
          className="bg-body-tertiary mb-3"
        >
          <Container>
            <Navbar.Brand>
              <NavItem className="text-decoration-none text-white">
                Ai-Content-Generator
              </NavItem>
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="d-flex align-items-center justify-content-center landing-container m-auto">
          <Card className="text-center w-75 landing-card border-0 p-0">
            <h1>Coming Soon!</h1>
            <p>
              🚀 Exciting News! We're cooking up something extraordinary in the
              world of content creation! 🚀
            </p>
            <p>
              Ever wondered how all those Reddit to Tiktok videos are made?
              Well, wonder no more! Soon you'll be able to create your own, in
              just a few clicks!
            </p>
            <h3>Stay Tuned for Launch:</h3>
            <p>
              Be among the first to easily grow your TikTok accounts for{" "}
              <span className="strong">free</span>!! Sign up now to receive
              exclusive early access and be notified when we release this!
            </p>
            <Form
              layout="vertical"
              name="custom-generation-form"
              onFinish={handleSubmit}
              onFinishFailed={() => {}}
              className="col-12 col-sm-12 col-md-12 m-auto"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Don't forget your email! 🙂" },
                ]}
              >
                <Input placeholder="e.g. janedoe@mail.com" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="subscribe-btn mb-1 mt-1"
                loading={loading}
              >
                Let me know when it releases!
              </Button>
            </Form>
            <p className={error ? "text-danger" : "text-success"}>{response}</p>
            <p>
              🚀{" "}
              <strong>
                AI Content Generator - Your gateway to instant reach
              </strong>{" "}
              🚀
            </p>{" "}
            <ReactPlayer
              url={landing_page_video}
              width="100%"
              maxheight="250px"
              controls
            />
          </Card>
        </Container>
        <div style={{ textAlign: "center", marginTop: "auto" }}>
          <Footer>ai-content-generator ©{new Date().getFullYear()} </Footer>
        </div>
      </div>
    </>
  );
}