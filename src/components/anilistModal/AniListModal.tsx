import { useState, useEffect } from 'react';
import { Input, List, Modal, Button } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { CheckOutlined } from '@ant-design/icons';
import { GetSearch } from '@graphql/queries';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import styles from './AniListModal.module.scss';

// import { db } from './db';

const { Search } = Input;

const AniListModal = () => {
  const [linked, setLinked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    checkLinked();
  }, []);

  const checkLinked = async () => {
    // const manga = await db.library.get({
    //   id: sessionStorage.getItem('mangaId'),
    // });
    // if (manga && manga.anilistId) {
    //   setLinked(true);
    // } else {
    //   setLinked(false);
    // }
  };

  const onSearch = (input: any) => {
    getSearch({
      variables: {
        search: input,
      },
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [getSearch, { loading, data }] = useLazyQuery(GetSearch);

  const handleClick = async (item: any) => {
    // if (await db.library.get({ id: sessionStorage.getItem('mangaId') })) {
    //   db.library.update(sessionStorage.getItem('mangaId'), {
    //     anilistId: item.id,
    //   });
    // }
    setLinked(true);
    setIsModalVisible(false);
  };

  const deleteLink = async () => {
    // db.library.update(sessionStorage.getItem('mangaId'), { anilistId: null });
    setLinked(false);
    setIsModalVisible(false);
  };

  return (
    <>
      {linked ? (
        <Button type="primary" icon={<CheckOutlined />} onClick={showModal}>
          Link to AniList
        </Button>
      ) : (
        <Button type="primary" onClick={showModal}>
          Link to AniList
        </Button>
      )}
      <Modal
        title="Link to Anilist"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <Button type="primary" onClick={() => deleteLink()} danger>
            Unlink
          </Button>
        }
      >
        <Search placeholder="search AniList" onSearch={onSearch} />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <List
            dataSource={data ? data.Page.media : []}
            renderItem={(item: any) => (
              <List.Item
                onClick={() => handleClick(item)}
                extra={<img src={item.coverImage.medium} alt="" />}
              >
                <List.Item.Meta
                  title={
                    <div>
                      {item.title.romaji}
                      <p className={styles.year}>{item.startDate.year}</p>
                    </div>
                  }
                  description={item.description}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
};

export { AniListModal };
