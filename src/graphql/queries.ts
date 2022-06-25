import { gql } from '@apollo/client';

export const GetList = gql`
  query ($userName: String, $status: MediaListStatus) {
    MediaListCollection(
      userName: $userName
      type: MANGA
      sort: UPDATED_TIME_DESC
      status: $status
    ) {
      lists {
        name
        entries {
          media {
            title {
              romaji
            }
            chapters
          }
          progress
          score
          id
        }
      }
    }
  }
`;
