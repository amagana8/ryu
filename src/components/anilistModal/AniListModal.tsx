import { useState } from 'react';
import { Input, List, Modal, Button, Image } from 'antd';
import { useLazyQuery } from '@apollo/client';
import { CheckOutlined } from '@ant-design/icons';
import { GetSearch } from '@graphql/queries';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';
import styles from './AniListModal.module.scss';
import { update } from '@services/db';
import { Manga } from '@models/Manga';

const { Search } = Input;

interface AniListModalProps {
  manga: Manga;
}

const AniListModal = ({ manga }: AniListModalProps) => {
  const [linked, setLinked] = useState(!!manga.anilistId);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    await update({
      ...manga,
      anilistId: item.id,
    });
    setLinked(true);
    setIsModalVisible(false);
  };

  const deleteLink = async () => {
    await update({
      ...manga,
      anilistId: null,
    });
    setLinked(false);
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={linked ? showModal : deleteLink}>
        {`${linked ? 'Link to' : 'Unlink from'} AniList`}
      </Button>
      <Modal
        title="Link to Anilist"
        visible={isModalVisible}
        onCancel={handleCancel}
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
                extra={
                  <Image
                    src={item.coverImage.medium ?? 'error'}
                    alt={`${item.title} Cover`}
                    fallback="https://i.imgur.com/fac0ifd.png"
                    preview={false}
                  />
                }
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
