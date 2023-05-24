import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_SITES } from "../gql/site";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sites = () => {
  const navigate = useNavigate();
  const { data: siteData, loading, error } = useQuery(GET_SITES);
  const sites = siteData?.sites;

  return (
    <>
      <h2>List of Site</h2>
      {loading && <h3>Loading Sites ...</h3>}
      {error && <h3>{JSON.stringify(error)}</h3>}
      {/* {sites && <h3>{JSON.stringify(sites)}</h3>} */}
      {sites?.length &&
        sites.map((site, index) => (
          <div
            key={index}
            style={{
              padding: 4,
              border: "1px solid #333333",
              margin: 4,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/site/${site.id}`)}
          >
            {index + 1}. ID: {site.id} - Name: {site.name}
          </div>
        ))}
    </>
  );
};

export default Sites;
