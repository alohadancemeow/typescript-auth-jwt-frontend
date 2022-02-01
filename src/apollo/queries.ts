import { gql } from "@apollo/client";

// # Query me
export const ME = gql`
    query Query {
        me {
            id
            username
            email
            roles
            createdAt
        }
    }
`

// # Query all users
export const USERS = gql`
    query Query {
        users {
            id
            username
            email
            roles
            createdAt
        }
    }
`