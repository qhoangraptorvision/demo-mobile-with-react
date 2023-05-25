import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrement, increment } from "../slices/auth";
import { useEffect, useState } from "react";
import Sites from "./Sites";
import { useQuery } from "@apollo/client";
import { GET_SITE } from "../gql/site";
import { socket } from "../socket";

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

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    console.log("Subs socket events");
    socket.on("connect", () => {
      console.log("socket connected");
      setSocketConnected(true);
    });

    socket.on(siteId, (data) => {
      setSocketShunt([data, ...socketShunt]);
      console.log("🚀 ~ SITE data:", data);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected!");
      setSocketConnected(false);
    });

    return () => {
      console.log("Unsubs socket events");
      // socket.off("connect");
      // socket.off("disconnect");
      // socket.off(siteId);
      if (currentZone) {
        socket.off(currentZone);
      }
    };
  }, []);

  const handleListenZoneEvent = (nextZoneId) => {
    console.log("🚀 ~ Listen event with Zone:", nextZoneId);
    if (currentZone) {
      socket.off(currentZone);
    }
    setCurrentZone(nextZoneId);
    socket.on(nextZoneId, (data) => {
      console.log("🚀 ~ ZONE data:", data);
      setSocketZone([data, ...socketZone]);
    });
  };

  return (
    <>
      <h1>Site Detail PAGE</h1>
      {/* <p>Is Auth {JSON.stringify(isAuth)}</p> */}
      {/* <p>TOKEN: {token}</p> */}
      {/* <p>siteData {JSON.stringify(siteData)}</p> */}

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
              <b>CAMERA:</b>
              {site.cameras?.length
                ? site.cameras.map((c) => (
                    <div key={c.id} style={{ border: "2px solid #f1f1f1" }}>
                      <div>{c.name}</div>
                      <div>
                        ZONE:{" "}
                        {c.zones?.map((z) => (
                          <div
                            style={{
                              display: "inline-block",
                              border: "1px solid blue",
                              marginLeft: 6,
                              padding: 4,
                              cursor: "pointer",
                            }}
                            key={z.id}
                            onClick={() => handleListenZoneEvent(z.id)}
                          >
                            {z.name}
                          </div>
                        ))}
                        {!c.zones?.length && "No zone."}
                      </div>
                    </div>
                  ))
                : "---"}
            </div>
          </div>
          <div style={{ marginLeft: 100, maxWidth: 400 }}>
            <h3>
              {`SOCKET - Connect to ${
                import.meta.env.VITE_PORTAL_SOCKET || "http://localhost:6789"
              }: ${JSON.stringify(socketConnected)}`}
            </h3>
            <h4>Shunt/Runaway Events</h4>
            <div>{JSON.stringify(socketShunt)}</div>
            <h4>Zone Events</h4>
            <div>{JSON.stringify(socketZone)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteDetail;
