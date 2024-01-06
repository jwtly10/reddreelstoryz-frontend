import { Container } from "react-bootstrap";
import { useState } from "react";
import ManualGenComponent from "../components/ManualGenComponent.tsx";
import RedditUrlGenComponent from "../components/RedditUrlGenComponent.tsx";

export default function Generate() {
  const [redditUrlMode, setRedditUrlMode] = useState(false);

  const handleRedditUrlMode = () => {
    setRedditUrlMode(!redditUrlMode);
  };

  return (
    <Container className="d-flex mt-5 mb-5 flex-column justify-content-center text-center">
      {!redditUrlMode ? (
        <>
          <h1>Generate with custom script</h1>
          <p>
            You can also{" "}
            <span className={"link"} onClick={handleRedditUrlMode}>
              {" "}
              generate a video from a Reddit URL
            </span>
            .
          </p>
          <ManualGenComponent />
        </>
      ) : (
        <>
          <h1>Generate from Reddit URL</h1>
          <p>
            Or maybe you want to{" "}
            <span className={"link"} onClick={handleRedditUrlMode}>
              {" "}
              manually enter a script
            </span>
            .
          </p>
          <RedditUrlGenComponent />
        </>
      )}
    </Container>
  );
}
