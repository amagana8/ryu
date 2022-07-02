import ky from 'ky';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Typography, Space, Divider, Spin } from 'antd';
// import { db } from './components/db';
// import { AniListModal } from './components/aniListModal';
import { HeartOutlined, HeartFilled, LoadingOutlined } from '@ant-design/icons';
import { AniListModal } from '@components/anilistModal/AniListModal';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const { Title } = Typography;

const MangaPage = () => {
  const [chapters, setChapters] = useState([]);
  const [favorited, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { mangaId, mangaTitle, coverId } = useLocation().state as any;

  useEffect(() => {
    const getData = async () => {
      // if (await db.library.get({ id: sessionStorage.getItem('mangaId') })) {
      //   setFavorite(true);
      // } else {
      //   setFavorite(false);
      // }
      setLoading(true);
      const response = (await ky
        .get(`https://api.mangadex.org/manga/${mangaId}/feed`, {
          searchParams: {
            'translatedLanguage[]': 'en',
            'order[chapter]': 'desc',
          },
        })
        .json()) as any;

      setLoading(false);
      setChapters(
        response.data.map((row: any) => ({
          key: row.id,
          chapter: row.attributes.chapter,
          hash: row.attributes.hash,
          data: row.attributes.data,
          title: row.attributes.title,
          chapterId: row.id,
          groupId: row.relationships[0].id,
        })),
      );
    };
    getData();
  }, []);

  function handleClick(record: any) {
    navigate('/reader', {
      state: {
        chapterId: record.chapterId,
        chapterHash: record.hash,
        chapterData: record.data,
        chapterNum: record.chapter,
      },
    });
  }

  async function addtoLibrary() {
    // await db.library.add({
    //   id: sessionStorage.getItem('mangaId'),
    //   title: sessionStorage.getItem('mangaTitle'),
    //   coverId: sessionStorage.getItem('coverId'),
    // });
    setFavorite(true);
  }

  async function removeFromLibrary() {
    // await db.library.delete(sessionStorage.getItem('mangaId'));
    setFavorite(false);
  }

  const columns = [
    {
      title: 'Chapter',
      dataIndex: 'chapter',
      width: 25,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 150,
      render: (text: any, record: any) => (
        <Button type="link" onClick={() => handleClick(record)}>
          {text}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Space split={<Divider type="vertical" />}>
        <Title>{mangaTitle}</Title>
        {favorited ? (
          <Button
            type="text"
            icon={<HeartFilled />}
            onClick={() => removeFromLibrary()}
          />
        ) : (
          <Button
            type="text"
            icon={<HeartOutlined />}
            onClick={() => addtoLibrary()}
          />
        )}
        <AniListModal />
      </Space>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          columns={columns}
          dataSource={chapters}
          pagination={{ pageSize: 50 }}
        />
      )}
    </>
  );
};

export { MangaPage };
