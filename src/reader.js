import axios from 'axios';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import { Layout, List, Spin } from 'antd';
import { SideBar } from './components/SideBar';
import { LoadingOutlined } from '@ant-design/icons';
import { db } from './components/db';

const { Content } = Layout;

const Reader = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GET_MEDIALIST = gql`
        query ($userId: Int, $mediaId: Int) {
            MediaList(userId: $userId, mediaId: $mediaId) {
                id
            }
        }
    `;

    const [getMediaList] = useLazyQuery(GET_MEDIALIST, {
        onCompleted: (data) => {
            updateProgress({
                variables: {
                    id: data.MediaList.id,
                    progress: sessionStorage.getItem("chapterNum")
                }
            });
        }
    });

    const UPDATE_PROGRESS = gql`
        mutation ($id: Int, $progress: Int) {
            SaveMediaListEntry (id: $id, progress: $progress) {
                id
                progress
            }
        }
    `;

    const [updateProgress] = useMutation(UPDATE_PROGRESS);

    const getData = async() => {
        const manga = await db.library.get(sessionStorage.getItem("mangaId"));
        getMediaList({
            variables: {
                userId: localStorage.getItem("UserId"),
                mediaId: manga.anilistId
            }
        });
        const pages = sessionStorage.getItem("chapterData").split(',');
        let images = [];
        let baseUrl = (await axios.get(`https://api.mangadex.org/at-home/server/${sessionStorage.getItem("chapterId")}`)).data.baseUrl;
        for (const page of pages) {
            await axios.get(`${baseUrl}/data/${sessionStorage.getItem("chapterHash")}/${page}`).then(res => {
                images.push(res);
                setLoading(false);
                setState(images.map(row => ({
                    Url: row.config.url
                })));
            });
        }
    }
    
    return(
        <div className="MangaPage">
            <Layout>
                <SideBar />
                <Content>
                    <div>
                        {loading ? (
                            <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <List
                                itemLayout="vertical"
                                size="large"
                                dataSource={state}
                                renderItem={item => (
                                    <List.Item>
                                        <img
                                            style={{
                                                display: 'block',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}
                                            src={item.Url}
                                            alt=""
                                        />
                                    </List.Item>
                                )}
                            >
                            </List>
                        )}
                    </div>
                </Content>
            </Layout>
        </div>
    );
}

export default Reader;
