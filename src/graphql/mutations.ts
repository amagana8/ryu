import { gql } from '@apollo/client';

export const UpdateScore = gql`
  mutation ($id: Int, $score: Float) {
    SaveMediaListEntry(id: $id, score: $score) {
      id
      score
    }
  }
`;

export const UpdateProgress = gql`
  mutation ($id: Int, $progress: Int) {
    SaveMediaListEntry(id: $id, progress: $progress) {
      id
      progress
    }
  }
`;

export const UpdateStatus = gql`
  mutation ($id: Int, $status: MediaListStatus) {
    SaveMediaListEntry(id: $id, status: $status) {
      id
      status
    }
  }
`;
