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
        <div>
          <p>Site ID: {site.id}</p>
          <p>Site Name: {site.name}</p>
          <p>
            CAMERA:{" "}
            {site.cameras?.length
              ? site.cameras.map((c) => <div key={c.id}>{c.name}</div>)
              : "---"}
          </p>
        </div>
      )}
    </>
  );
};

export default SiteDetail;
