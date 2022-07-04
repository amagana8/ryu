import ky from 'ky';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Table, Typography, Space, Divider } from 'antd';
import { get, add, remove } from '@services/db';
import { AniListModal } from '@components/anilistModal/AniListModal';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { Manga } from '@models/Manga';

const { Title } = Typography;

const MangaPage = () => {
  const [chapters, setChapters] = useState([]);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const currentManga = useLocation().state as Manga;

  useEffect(() => {
    const getData = async () => {
      const libEntry = (await get(currentManga.mangadexId)) as any;
      if (libEntry.length) {
        setFavorited(true);
      } else {
        setFavorited(false);
      }
      setLoading(true);
      const response = (await ky
        .get(`https://api.mangadex.org/manga/${currentManga.mangadexId}/feed`, {
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
        chapterNum: record.chapter,
        mangaId: currentManga.mangadexId,
      },
    });
  }

  async function addtoLibrary() {
    await add(currentManga);
    setFavorited(true);
  }

  async function removeFromLibrary() {
    await remove(currentManga.mangadexId);
    setFavorited(false);
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
        <Title>{currentManga.title}</Title>
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
        <AniListModal manga={currentManga} />
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
