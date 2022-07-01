import { gql } from '@apollo/client';

export const GetList = gql`
  query ($userId: Int, $status: MediaListStatus) {
    MediaListCollection(
      userId: $userId
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
