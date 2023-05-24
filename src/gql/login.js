import { gql } from "@apollo/client";

export const LOGIN_QUERY = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        full_name
        phone
        email
        user_status
        role
        is_change_password
        partner {
          id
          name
        }
      }
      token
      initData
    }
  }
`;
