import { useQuery } from '@apollo/client';
import { Table, Alert } from 'antd';
import { GetHistory } from '@graphql/queries';
import { useContext } from 'react';
import { UserContext } from '@contexts/UserContext';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const History = () => {
  const { user } = useContext(UserContext);
  
  const { loading, data } = useQuery(GetHistory, {
    variables: {
      userId: user.anilistId,
    },
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: 'Chapter',
      dataIndex: 'progress',
      width: 150,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: 150,
    },
  ];

  return (
    <>
      {user.anilistId ? (
        <>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={columns}
              dataSource={data.Page.activities.map((row: any) => ({
                title: row.media.title.romaji,
                progress: row.progress,
                date: new Date(row.createdAt * 1000).toLocaleDateString(),
              }))}
              pagination={{ pageSize: 50 }}
            />
          )}
        </>
      ) : (
        <Alert
          message="No AniList Account"
          description="Please go to settings and login with AniList to see your manga list."
          type="info"
          showIcon
        />
      )}
    </>
  );
};

export { History };
