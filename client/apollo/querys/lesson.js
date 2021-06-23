import { gql } from "@apollo/client";

export const ALL_LESSON = gql`
    query {
        lessons {
            id
            link
            contentId
        }
    }
`;
