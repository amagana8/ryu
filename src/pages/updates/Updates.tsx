import { fetch } from '@tauri-apps/api/http';
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
        const { data: feed } = await fetch<any>(
          'https://api.mangadex.org/user/follows/manga/feed',
          {
            method: 'GET',
            headers: {
              Authorization: user.mangadexToken,
            },
            query: {
              'translatedLanguage[]': 'en',
              'order[updatedAt]': 'desc',
            },
          },
        );
        const feedData = feed.data.map((row: any, index: number) => ({
          key: index,
          manga: row.relationships.find((rel: any) => rel.type === 'manga').id,
          chapter: row.attributes.chapter,
        }));
        for (const chapter of feedData) {
          const { data: chapterData } = await fetch<any>(
            `https://api.mangadex.org/manga/${chapter.manga}`,
            { method: 'GET' },
          );
          chapter.manga = chapterData.data.attributes.title.en;
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
