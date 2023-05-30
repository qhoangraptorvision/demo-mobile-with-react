import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

const STANDARD_WIDTH = 640;
const STANDARD_HEIGHT = 480;

const getWidth = (videoRef) => {
  if (videoRef?.current) {
    const { videoWidth, videoHeight, height } = videoRef.current;
    return (height * videoWidth) / videoHeight;
  }

  return STANDARD_WIDTH;
};

const StreamVideo = ({ streamUrl, zone }) => {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const [widthRatio, setWidthRatio] = useState(1);
  const [heightRatio, setHeightRatio] = useState(1);
  const [zonePoints, setZonePoints] = useState([]);
  const width = getWidth(videoRef);

  useEffect(() => {
    console.log("🚀 ~ streamUrl:", streamUrl);
  }, [streamUrl]);

  useEffect(() => {
    let points = [];
    zone?.points?.forEach(([x, y]) => {
      points.push(parseInt(x * widthRatio));
      points.push(parseInt(y * heightRatio));
    });
    setZonePoints(points);
  }, [heightRatio, widthRatio, zone]);

  const handleLoadStartVideo = () => {
    setLoading(true);
  };

  const handleCanPlayThroughVideo = () => {
    setLoading(false);
    if (videoRef?.current) {
      const { videoWidth, videoHeight, height } = videoRef.current;
      const width = (height * videoWidth) / videoHeight;
      setWidthRatio(width / STANDARD_WIDTH);
      setHeightRatio(height / STANDARD_HEIGHT);
    }
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
        <div
          style={{
            position: "relative",
            border: "1px solid #232323",
            height: STANDARD_HEIGHT,
            width: width,
          }}
        >
          <video
            ref={videoRef}
            height={STANDARD_HEIGHT}
            width={width}
            autoPlay
            src={streamUrl}
            onLoadStart={handleLoadStartVideo}
            onCanPlayThrough={handleCanPlayThroughVideo}
          />
          {zone?.id && (
            <Stage
              width={width}
              height={STANDARD_HEIGHT}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <Layer>
                <Line
                  points={zonePoints}
                  fill={zone?.color}
                  stroke={"red"}
                  strokeWidth={1}
                  closed={true}
                  opacity={0.3}
                />
              </Layer>
            </Stage>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamVideo;
