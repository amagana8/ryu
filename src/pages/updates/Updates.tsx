import ky from 'ky';
import { useState, useEffect, useContext } from 'react';
import { Table, message } from 'antd';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { UserContext } from '@contexts/UserContext';

const Updates = () => {
  const { user } = useContext(UserContext);

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const feed = await ky.get(
          'https://api.mangadex.org/user/follows/manga/feed',
          {
            headers: {
              Authorization: user.mangadexToken,
            },
            searchParams: {
              'translatedLanguage[]': 'en',
              'order[updatedAt]': 'desc',
            },
          },
        ).json() as any;
        const feedData = feed.data.map((row: any, index: number) => ({
          key: index,
          manga: row.relationships.find((rel: any) => rel.type === 'manga').id,
          chapter: row.attributes.chapter,
        }));
        for (const chapter of feedData) {
          const response = await ky.get(`https://api.mangadex.org/manga/${chapter.manga}`).json() as any;
          chapter.manga = response.data.attributes.title.en;
        }
        setUpdates(feedData);
      } catch (error) {
        message.error(
          'Could not retrieve list. Please ensure you are logged into Mangadex.',
        );
        console.log(error);
      }
      setLoading(false);
    };
    getData();
  }, []);

  const columns = [
    {
      title: 'Manga',
      dataIndex: 'manga',
      width: 150,
    },
    {
      title: 'Chapter',
      dataIndex: 'chapter',
      width: 150,
    },
  ];

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          dataSource={updates}
          columns={columns}
          pagination={{ pageSize: 50 }}
        />
      )}
    </>
  );
};

export { Updates };
