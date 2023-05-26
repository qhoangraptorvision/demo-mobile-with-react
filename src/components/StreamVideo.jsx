import { useEffect, useState } from "react";

const StreamVideo = ({ streamUrl }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🚀 ~ streamUrl:", streamUrl);
  }, [streamUrl]);

  const handleLoadStartVideo = () => {
    setLoading(true);
  };

  const handleCanPlayThroughVideo = () => {
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 64 }}>
      <h4>VIDEO STREAM</h4>
      {loading && (
        <div
          style={{
            border: "1px solid blue",
            borderRadius: 20,
            textAlign: "center",
            padding: 20,
            margin: 20,
          }}
        >
          STREAM LOADING ...
        </div>
      )}
      {streamUrl && (
        <video
          width="640"
          height="480"
          autoPlay
          src={streamUrl}
          onLoadStart={handleLoadStartVideo}
          onCanPlayThrough={handleCanPlayThroughVideo}
        />
      )}
    </div>
  );
};

export default StreamVideo;
