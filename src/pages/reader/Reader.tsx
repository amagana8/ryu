import { fetch, ResponseType } from '@tauri-apps/api/http';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useState, useEffect, useContext } from 'react';
import { message, Image } from 'antd';
import { get } from '@services/db';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { UpdateProgress } from '@graphql/mutations';
import { GetMediaList } from '@graphql/queries';
import { useLocation } from 'react-router-dom';
import styles from './Reader.module.scss';
import { UserContext } from '@contexts/UserContext';

const Reader = () => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const currentChapter = useLocation().state as any;
  const { user } = useContext(UserContext);
  const [updateProgress] = useMutation(UpdateProgress);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const manga = (await get(currentChapter.mangaId)) as any;
      if (manga?.[0]?.anilistId) {
        getMediaList({
          variables: {
            userId: user.anilistId,
            mediaId: manga[0].anilistId,
          },
        });
      }
      const { data: chapterData } = await fetch<any>(
        `https://api.mangadex.org/at-home/server/${currentChapter.chapterId}`,
        { method: 'GET' },
      );
      const baseUrl = chapterData.baseUrl;
      const { hash, data } = chapterData.chapter;
      for (const page of data) {
        try {
          const res = await fetch<any>(`${baseUrl}/data/${hash}/${page}`, {
            method: 'GET',
            responseType: ResponseType.Binary,
          });
          setLoading(false);
          setPages((prevState) => [...prevState, res.url]);
        } catch (error) {
          message.error('Chapter not available.');
          setLoading(false);
          console.log(error);
        }
      }
    };

    getData();
  }, []);

  const [getMediaList] = useLazyQuery(GetMediaList, {
    onCompleted: (data) => {
      updateProgress({
        variables: {
          id: data.MediaList.id,
          progress: currentChapter.chapterNum,
        },
      });
    },
  });

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ul>
          {pages.map((page: string, index: number) => (
            <li className={styles.page} key={index}>
              <Image
                src={page ?? 'error'}
                alt={`Page ${index + 1}`}
                preview={false}
                fallback="https://i.imgur.com/fac0ifd.png"
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export { Reader };
