import ky from 'ky';
import { useState, useEffect } from 'react';
import { List, Card, Button } from 'antd';
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
          const response = (await ky
            .get(`https://api.mangadex.org/cover/${manga.coverId}`)
            .json()) as any;
          manga.cover = `https://uploads.mangadex.org/covers/${manga.mangadexId}/${response.data.attributes.fileName}`;
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
            <Button type="text" onClick={() => handleClick(item)}>
              <List.Item>
                <Card
                  loading={loading}
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img style={{ height: 360 }} src={item.cover} alt="" />
                  }
                >
                  <Meta description={item.title} />
                </Card>
              </List.Item>
            </Button>
          )}
        />
      )}
    </>
  );
};

export { MangaGrid };
