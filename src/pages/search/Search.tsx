import { fetch } from '@tauri-apps/api/http';
import { useState } from 'react';
import { Input } from 'antd';
import { MangaGrid } from '@components/mangaGrid/MangaGrid';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import styles from './Search.module.scss';

const Search = () => {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (value: any) => {
    setLoading(true);
    const { data: mangaData } = await fetch<any>(
      'https://api.mangadex.org/manga',
      {
        method: 'GET',
        query: {
          title: value,
          'contentRating[]': 'safe',
          'order[relevance]': 'desc',
        },
      },
    );

    setLoading(false);
    setManga(
      mangaData.data.map((row: any) => ({
        title: row.attributes.title.en || row.attributes.title.ja,
        mangadexId: row.id,
        coverId: row.relationships.find((rel: any) => rel.type === 'cover_art')
          ? row.relationships.find((rel: any) => rel.type === 'cover_art').id
          : null,
      })),
    );
  };

  return (
    <>
      <Input.Search
        placeholder="search MangaDex"
        onSearch={getData}
        className={styles.searchBox}
      />
      {loading ? <LoadingSpinner /> : <MangaGrid mangas={manga} />}
    </>
  );
};

export { Search };
