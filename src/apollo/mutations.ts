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