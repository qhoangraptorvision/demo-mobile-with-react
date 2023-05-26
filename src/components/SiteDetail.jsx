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
  const [currentStreamUrl, setCurrentStreamUrl] = useState();

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    console.log("Subs socket events");
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

    if (newEvent.type === "STREAM_CAMERAS") {
      console.log("🚀 ~ newEvent.data:", newEvent.data);
      setStreamMapper(newEvent.data);
    } else if (newEvent.type === "SHUNT" || newEvent.type === "RUNAWAY") {
      setSocketShunt([newEvent, ...socketShunt]);
    } else {
      setSocketZone([newEvent, ...socketZone]);
    }
  }, [newEvent]);

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
                      <th>ID</th>
                      <th>Name</th>
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
                        <td>{c.id}</td>
                        <td>{c.camera_name}</td>
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
              <StreamVideo streamUrl={currentStreamUrl} />
            </div>
          </div>
          <div style={{ marginLeft: 100 }}>
            <h3>
              {`SOCKET - Connect to ${
                import.meta.env.VITE_PORTAL_SOCKET || "http://localhost:6789"
              }: ${JSON.stringify(socketConnected)}`}
            </h3>

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
