import { useState, useEffect } from 'react';
import { Input, List, Spin, Modal, Button } from 'antd';
import { gql, useLazyQuery } from '@apollo/client';
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import { db } from './db';


const { Search } = Input;

function AniListModal(props) {
    const [linked, setLinked] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    useEffect(() => {
        checkLinked();
    }, []);

    const checkLinked = async() => {
        const manga = await db.library.get({id: sessionStorage.getItem("mangaId")});
        if (manga && manga.anilistId) {
            setLinked(true);
        }
        else {
            setLinked(false);
        }
    }

    const onSearch = (input) => {
        getSearch({
            variables: {
                search: input
            }
        });
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    const GET_SEARCH = gql`
        query($search: String) {
            Page {
                media(type: MANGA, search: $search) {
                    id
                    title {
                        romaji
                    }
                    startDate {
                        year
                    }
                    description
                    coverImage {
                        medium
                    }
                }
            }
        }
    `;

    const [getSearch, {loading, data}] = useLazyQuery(GET_SEARCH);

    const handleClick = async(item) => {
        if (await db.library.get({id: sessionStorage.getItem("mangaId")})) {
            db.library.update(sessionStorage.getItem("mangaId"), {anilistId: item.id});
        }
        setLinked(true);
        setIsModalVisible(false);
    }

    const deleteLink = async() => {
        db.library.update(sessionStorage.getItem("mangaId"), {anilistId: null});
        setLinked(false);
        setIsModalVisible(false);
    }

    return(
        <div>
            <div>
                {linked ? (
                    <Button type="primary" icon={<CheckOutlined />} onClick={showModal}>Link to AniList</Button>
                ) : (
                    <Button type="primary" onClick={showModal}>Link to AniList</Button>
                )}
            </div>
            <Modal
                title="Link to Anilist"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={<Button type="primary" onClick={() => deleteLink()} danger>Unlink</Button>}
            >
                <Search
                    placeholder="search AniList"
                    onSearch={onSearch}
                />
                <div>
                    {loading ? (
                        <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    ) : (
                        <List
                            dataSource={data ? data.Page.media : []}
                            renderItem={item => (
                                <List.Item onClick={() => handleClick(item)} extra={<img src={item.coverImage.medium} alt="" />}>
                                    <List.Item.Meta
                                        title={<div>{item.title.romaji}<p style={{fontWeight: 'normal', color: '#B3B3B3'}}>{item.startDate.year}</p></div>}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}

export { AniListModal };