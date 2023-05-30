import { gql } from "@apollo/client";

export const GET_SITES = gql`
  query Sites {
    sites {
      id
      name
    }
  }
`;

export const GET_SITE = gql`
  query Site($siteId: String!) {
    site(id: $siteId) {
      id
      name
      cameras {
        camera_name
        id
        name
        zones {
          id
          name
          points
          color
        }
      }
    }
  }
`;
