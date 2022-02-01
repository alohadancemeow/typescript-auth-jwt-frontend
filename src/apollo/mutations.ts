import { gql } from '@apollo/client'

// GRAPHQL: signup
export const SIGNUP = gql`
    mutation Mutation($password: String!, $email: String!, $username: String!) {
        signup(password: $password, email: $email, username: $username) {
            id
            username
            email
            roles
            createdAt
        }
    }
`

// # Signout
export const SIGNOUT = gql`
    mutation Mutation {
        signout {
            message
        }
    }
`

// # Singin
export const SIGNIN = gql`
    mutation Mutation($password: String!, $email: String!) {
        signin(password: $password, email: $email) {
            id
            username
            email
            roles
            createdAt
        }
    }
`

// # Request reset password
export const REQUEST_RESET_PASSWORD = gql`
    mutation Mutation($email: String!) {
        requestResetPassword(email: $email) {
            message
        }
    }
`

// # Reset password
export const RESET_PASSWORD = gql`
    mutation Mutation($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            message
        }
    }
`

// # Update roles
export const UPDATE_ROLES = gql`
    mutation Mutation($userId: String!, $newRoles: [String!]!) {
        updateRoles(userId: $userId, newRoles: $newRoles) {
            id
            username
            email
            roles
            createdAt
        }
    }
`