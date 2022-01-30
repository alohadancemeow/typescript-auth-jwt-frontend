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