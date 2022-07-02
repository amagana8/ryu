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

export const GetSearch = gql`
  query ($search: String) {
    Page {
      media(type: MANGA, search: $search) {
        id
        title {
          romaji
        }
        startDate {
          year
        }
        description
        coverImage {
          medium
        }
      }
    }
  }
`;

export const GetHistory = gql`
  query ($userId: Int) {
    Page {
      activities(userId: $userId, type_in: MANGA_LIST, sort: ID_DESC) {
        ... on ListActivity {
          progress
          createdAt
          media {
            title {
              romaji
            }
          }
        }
      }
    }
  }
`;
