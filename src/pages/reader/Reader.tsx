import { fetch, ResponseType } from '@tauri-apps/api/http';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { List, message } from 'antd';
import { get } from '@services/db';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import { UpdateProgress } from '@graphql/mutations';
import { GetMediaList } from '@graphql/queries';
import { useLocation } from 'react-router-dom';

const Reader = () => {
  const [pages, setPages] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const currentChapter = useLocation().state as any;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const manga = (await get(currentChapter.mangadexId)) as any;
      if (manga.length) {
        getMediaList({
          variables: {
            userId: localStorage.getItem('UserId'),
            mediaId: manga.anilistId,
          },
        });
      }
      let images = [];
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
          images.push(res);
          setLoading(false);
          setPages(
            images.map((image: any) => ({
              url: image.url,
            })),
          );
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

  const [updateProgress] = useMutation(UpdateProgress);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={pages}
          renderItem={(page: any) => (
            <List.Item>
              <img
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                src={page.url}
                alt=""
              />
            </List.Item>
          )}
        ></List>
      )}
    </>
  );
};

export { Reader };
