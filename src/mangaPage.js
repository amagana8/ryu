import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Layout, Table, Typography, Space, Divider, Spin } from 'antd';
import { SideBar } from './components/SideBar';
import { db } from './components/db';
import { AniListModal } from './components/aniListModal';
import { HeartOutlined, HeartFilled, LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

const MangaPage = () => {

    const [state, setState] = useState([]);
    const [favorited, setFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const history = useHistory();

    const getData = async() => {
        if (await db.library.get({id: sessionStorage.getItem("mangaId")})) {
            setFavorite(true);
        } else {
            setFavorite(false);
        }
        await axios.get(`https://api.mangadex.org/manga/${sessionStorage.getItem("mangaId")}/feed`, {
            params: {
                'translatedLanguage': ['en'],
                'order[chapter]': 'desc'
            }
        })
        .then(res => {
            setLoading(false);
            setState(res.data.data.map(row => ({
                key: row.id,
                Chapter: row.attributes.chapter,
                Hash: row.attributes.hash,
                Data: row.attributes.data,
                Title: row.attributes.title,
                ChapterId: row.id,
                GroupId: row.relationships[0].id
            })));
        });
    }

    function handleClick(record) {
        sessionStorage.setItem("chapterId", record.ChapterId);
        sessionStorage.setItem("chapterHash", record.Hash);
        sessionStorage.setItem("chapterData", record.Data);
        sessionStorage.setItem("chapterNum", record.Chapter);
        history.push("/reader");
    }

    async function addtoLibrary() {
        await db.library.add({
            id: sessionStorage.getItem("mangaId"),
            title: sessionStorage.getItem("mangaTitle"),
            coverId: sessionStorage.getItem("coverId")
        });
        setFavorite(true);
    }

    async function removeFromLibrary() {
        await db.library.delete(sessionStorage.getItem("mangaId"));
        setFavorite(false);
    }

    const columns = [
        {
            title: 'Chapter',
            dataIndex: 'Chapter',
            width: 25
        },
        {
            title: 'Title',
            dataIndex: 'Title',
            width: 150,
            render:(text, record) => (
                <div><Button type="link" onClick={() => handleClick(record)}>{text}</Button></div>
            )
        }
    ];
    
    return(
        <div className="MangaPage">
            <Layout>
                <SideBar />
                <Content>
                    <Space split={<Divider type="vertical" />}>
                        <Title>{sessionStorage.getItem("mangaTitle")}</Title>
                        <div>
                            {favorited ? (
                                <Button type="text" icon={<HeartFilled />} onClick={() => removeFromLibrary()} />
                            ) : (
                                <Button type="text" icon={<HeartOutlined />} onClick={() => addtoLibrary()}/>
                            )}
                        </div>
                        <AniListModal />
                    </Space>
                    <div>
                        {loading ? (
                            <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <Table
                            columns={columns}
                            dataSource={state}
                            pagination={{ pageSize: 50 }}
                            />
                        )}
                    </div>
                </Content>
            </Layout>
        </div>
    );
}

export default MangaPage;
