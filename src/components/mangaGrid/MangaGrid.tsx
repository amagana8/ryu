import { fetch } from '@tauri-apps/api/http';
import { useState, useEffect } from 'react';
import { List, Card, Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import styles from './MangaGrid.module.scss';

const { Meta } = Card;

interface MangaGridProps {
  mangas: any;
}

const MangaGrid = ({ mangas }: MangaGridProps) => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      for (const manga of mangas) {
        if (manga.coverId) {
          const { data: mangaData } = await fetch<any>(
            `https://api.mangadex.org/cover/${manga.coverId}`,
            { method: 'GET' },
          );
          manga.cover = `https://uploads.mangadex.org/covers/${manga.mangadexId}/${mangaData.data.attributes.fileName}`;
        } else {
          manga.cover = '#';
        }
      }
      setList(mangas);
      setLoading(false);
    }
    getData();
  }, [mangas]);

  function handleClick(record: any) {
    navigate('/mangaPage', {
      state: {
        mangadexId: record.mangadexId,
        coverId: record.coverId,
        title: record.title,
      },
    });
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          className={styles.list}
          dataSource={list}
          renderItem={(item) => (
              <List.Item onClick={() => handleClick(item)}>
                <Card
                  loading={loading}
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <Image
                      height={360}
                      width={240}
                      preview={false}
                      src={item.cover ?? 'error'}
                      alt={`${item.title} Cover`}
                      fallback="https://i.imgur.com/fac0ifd.png"
                    />
                  }
                >
                  <Meta description={item.title} />
                </Card>
              </List.Item>
          )}
        />
      )}
    </>
  );
};

export { MangaGrid };
