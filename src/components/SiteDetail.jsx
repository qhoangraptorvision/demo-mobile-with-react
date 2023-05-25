import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrement, increment } from "../slices/auth";
import { useEffect } from "react";
import Sites from "./Sites";
import { useQuery } from "@apollo/client";
import { GET_SITE } from "../gql/site";

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

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

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
          <div style={{ marginLeft: 100 }}>
            <h3>
              SOCKET: Connect to{" "}
              {import.meta.env.VITE_PORTAL_SOCKET || "http://localhost:6789"}
            </h3>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteDetail;
