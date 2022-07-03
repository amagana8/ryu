import { useState, useEffect } from 'react';
import { MangaGrid } from '@components/mangaGrid/MangaGrid';
import { all, conenct } from '@services/db';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { Manga } from '@models/Manga';

const Library = () => {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await conenct();
      const library = await all();
      setManga(library);
      setLoading(false);
    };
    getData();
  }, []);

  return <>{loading ? <LoadingSpinner /> : <MangaGrid mangas={manga} />}</>;
};

export { Library };
