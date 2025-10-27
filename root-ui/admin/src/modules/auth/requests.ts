import { gql } from '@apollo/client';

export const GET_AUTH_USER = gql`
  query GetAuthUser {
    getAuthUser {
      id
      email
      firstName
      lastName
    }
  }
`;

export const POST_AUTH_USER = gql`
  mutation PostAuthUser($email: String!, $password: String!) {
    postAuthUser(email: $email, password: $password) {
      id
      email
      firstName
      lastName
    }
  }
`;

export type RefreshAuthTokenResponse = {
  refreshAuthToken: {
    token: string;
  };
};
export const REFRESH_AUTH_TOKEN = gql`
  mutation RefreshAuthToken {
    refreshAuthToken {
      token
    }
  }
`;

export const POST_FORGOT_PASSWORD = gql`
  mutation PostForgotPassword($email: String!) {
    postForgotPassword(email: $email) {
      email
    }
  }
`;
