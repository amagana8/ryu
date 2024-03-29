import { fetch } from '@tauri-apps/api/http';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, List, Typography, Space, Divider } from 'antd';
import { get, add, remove } from '@services/db';
import { AniListModal } from '@components/anilistModal/AniListModal';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { Manga } from '@models/Manga';

const { Title } = Typography;

interface ChapterLinkProps {
  chapter: any;
  children: JSX.Element;
}

const MangaPage = () => {
  const [chapters, setChapters] = useState([]);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const { data: feedData } = await fetch<any>(
        `https://api.mangadex.org/manga/${currentManga.mangadexId}/feed`,
        {
          method: 'GET',
          query: {
            'translatedLanguage[]': 'en',
            'order[chapter]': 'desc',
          },
        },
      );

      setLoading(false);
      setChapters(
        feedData.data.map((row: any) => ({
          num: row.attributes.chapter,
          title: row.attributes.title,
          chapterId: row.id,
          groupId: row.relationships[0].id,
        })),
      );
    };
    getData();
  }, []);

  async function addtoLibrary() {
    await add(currentManga);
    setFavorited(true);
  }

  async function removeFromLibrary() {
    await remove(currentManga.mangadexId);
    setFavorited(false);
  }

  const ChapterLink = ({ chapter, children }: ChapterLinkProps) => (
    <Link
      to="/reader"
      state={{
        chapterId: chapter.chapterId,
        chapterNum: chapter.num,
        mangaId: currentManga.mangadexId,
      }}
    >
      {children}
    </Link>
  );

  return (
    <>
      <Space split={<Divider type="vertical" />}>
        <Title>{currentManga.title}</Title>
        <Button
          type="text"
          icon={favorited ? <HeartFilled /> : <HeartOutlined />}
          onClick={favorited ? removeFromLibrary : addtoLibrary}
        />
        <AniListModal manga={currentManga} />
      </Space>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <List
          dataSource={chapters}
          renderItem={(chapter: any) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <ChapterLink chapter={chapter}>{chapter.num}</ChapterLink>
                }
                description={
                  <ChapterLink chapter={chapter}>{chapter.title}</ChapterLink>
                }
              />
            </List.Item>
          )}
          pagination={{ pageSize: 50 }}
        />
      )}
    </>
  );
};

export { MangaPage };
