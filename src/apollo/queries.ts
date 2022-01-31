import { gql } from "@apollo/client";

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