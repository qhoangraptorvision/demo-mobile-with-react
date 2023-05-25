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
      <div style={{ display: "flex", justifyContent: "center" }}>
        {sites?.length && (
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site, index) => (
                <tr
                  key={index}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/site/${site.id}`)}
                >
                  <td>{index + 1}</td>
                  <td>{site.id}</td>
                  <td>{site.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Sites;
