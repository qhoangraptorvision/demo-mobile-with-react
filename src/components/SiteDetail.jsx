import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrement, increment } from "../slices/auth";
import { useEffect, useState } from "react";
import Sites from "./Sites";
import { useQuery } from "@apollo/client";
import { GET_SITE } from "../gql/site";
import { socket } from "../socket";
import StreamVideo from "./StreamVideo";

const SiteDetail = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const {
    data: siteData,
    loading,
    error,
  } = useQuery(GET_SITE, { variables: { siteId } });
  const site = siteData?.site;
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketShunt, setSocketShunt] = useState([]);
  const [socketZone, setSocketZone] = useState([]);
  const [currentZone, setCurrentZone] = useState(null);
  const [newEvent, setNewEvent] = useState();
  const [streamMapper, setStreamMapper] = useState({});
  const [statusMapper, setStatusMapper] = useState({});
  const [thumbnailMapper, setThumbnailMapper] = useState({});
  const [currentStreamUrl, setCurrentStreamUrl] = useState();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    console.log("Subs socket events");

    socket.connect();
    socket.on("connect", () => {
      console.log("socket connected");
      socket.emit("CURRENT_SITE_DATA", {
        siteId,
      });
      setSocketConnected(true);
    });

    socket.on(siteId, (data) => {
      setNewEvent(data);
      console.log("🚀 ~ SITE data:", data);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected!");
      setSocketConnected(false);
    });

    return () => {
      console.log("Unsubs socket events");
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
      socket.off(siteId);
    };
  }, []);

  useEffect(() => {
    socket.on(currentZone, handleListenZoneEvent);

    return () => {
      if (currentZone) {
        socket.off(currentZone);
      }
    };
  }, [currentZone]);

  useEffect(() => {
    if (!newEvent) return;

    switch (newEvent.type) {
      case "STREAM_CAMERAS":
        setStreamMapper(newEvent.data);
        break;
      case "STATUS_CAMERAS":
        setStatusMapper(newEvent.data);
        break;
      case "THUMBNAIL_CAMERAS":
        setThumbnailMapper(newEvent.data);
        break;

      case "SHUNT":
      case "RUNAWAY":
        setSocketShunt([newEvent, ...socketShunt]);
        break;
      default:
        setSocketZone([newEvent, ...socketZone]);
        break;
    }
  }, [newEvent]);

  useEffect(() => {}, [statusMapper]);

  const handleListenZoneEvent = (data) => {
    console.log("🚀 ~ ZONE data:", data);
    setNewEvent(data);
  };

  const handleClickZone = (nextZoneId) => {
    console.log("🚀 ~ Listen event with Zone:", nextZoneId);
    setCurrentZone(nextZoneId);
  };

  const handleClickCamera = (cameraId) => {
    const streamUrl = streamMapper[cameraId]?.streamUrl;
    setCurrentStreamUrl(streamUrl);
  };

  return (
    <>
      <h2>Site Detail PAGE</h2>
      {site && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p>Site ID: {site.id}</p>
            <p>Site Name: {site.name}</p>
            <div>
              <div>
                <b>CAMERA LIST</b>
              </div>
              {site.cameras?.length ? (
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Thumbnail</th>
                      <th>Camera</th>
                      <th>Zone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {site.cameras.map((c, index) => (
                      <tr
                        key={c.id}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => handleClickCamera(c.id)}
                      >
                        <td>{index + 1}</td>
                        <td>
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <img
                              src={`data:image/png;base64, ${
                                thumbnailMapper[c.id]?.thumbnail_base64
                              }`}
                              alt="No thumbnail."
                              style={{
                                height: "80px",
                                objectFit: "contain",
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "3px",
                                left: "3px",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                backgroundColor: statusMapper[c.id]?.online
                                  ? "green"
                                  : "red",
                              }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          <div>Name: {c.camera_name}</div>
                          <div>ID: {c.id}</div>
                        </td>
                        <td>
                          {c.zones?.map((z) => (
                            <div
                              style={{
                                display: "inline-block",
                                border: `1px solid ${
                                  z.id === currentZone ? "red" : "blue"
                                }`,
                                marginLeft: 6,
                                padding: 4,
                                cursor: "pointer",
                              }}
                              key={z.id}
                              onClick={() => handleClickZone(z.id)}
                            >
                              {z.name}
                            </div>
                          ))}
                          {!c.zones?.length && "No zone."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "No camera"
              )}
            </div>
          </div>
          <div style={{ marginLeft: 100 }}>
            <h3>
              {`SOCKET - Connect to ${
                import.meta.env.VITE_PORTAL_SOCKET || "http://localhost:6789"
              }: ${JSON.stringify(socketConnected)}`}
            </h3>
            <div>
              <StreamVideo streamUrl={currentStreamUrl} />
            </div>
            <h4>Shunt/Runaway Events</h4>
            {/* <div>{JSON.stringify(socketShunt)}</div> */}
            <div>
              {socketShunt.map((e, index) => (
                <div
                  key={index}
                  style={{
                    background: "",
                    left: 0,
                    borderBottom: "1px solid #c2c2c2",
                  }}
                >
                  <p>{JSON.stringify(e)}</p>
                  {/* <p>========================</p> */}
                </div>
              ))}
            </div>
            <h4>Zone Events</h4>
            <div>
              {socketZone.map((e, index) => (
                <div
                  key={index}
                  style={{
                    background: "",
                    left: 0,
                    borderBottom: "1px solid #c2c2c2",
                  }}
                >
                  <p>{JSON.stringify(e)}</p>
                  {/* <p>========================</p> */}
                </div>
              ))}
            </div>
            {/* <div>{JSON.stringify(socketZone)}</div> */}
          </div>
        </div>
      )}
      {/* {site && <StreamVideo streamUrl={currentStreamUrl} />} */}
    </>
  );
};

export default SiteDetail;
