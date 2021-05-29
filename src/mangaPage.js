import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Layout, Table, Typography } from 'antd';
import SideBar from './components/SideBar';

const { Content, Sider } = Layout;
const { Title } = Typography;

const MangaPage = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const history = useHistory();

    const getData = async() => {
        await axios.get(`https://api.mangadex.org/manga/${sessionStorage.getItem("mangaId")}/feed`, {
            params: {
                'translatedLanguage': ['en'],
                'order[chapter]': 'desc'
            }
        })
        .then(res => {
            setLoading(false);
            setState(res.data.results.map(row => ({
                Chapter: row.data.attributes.chapter,
                Hash: row.data.attributes.hash,
                Data: row.data.attributes.data,
                Title: row.data.attributes.title,
                ChapterId: row.data.id,
                GroupId: row.relationships[0].id
            })));
        });
    }

    function handleClick(record) {
        sessionStorage.setItem("chapterId", record.ChapterId);
        sessionStorage.setItem("chapterHash", record.Hash);
        sessionStorage.setItem("chapterData", record.Data);
        history.push("/reader");
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
                <Sider>
                    <SideBar item='3'/>
                </Sider>
                <Content>
                    <Title>{sessionStorage.getItem("mangaTitle")}</Title>
                <div>
                    {loading ? (
                        "Loading"
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
