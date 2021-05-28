import axios from 'axios';
import {useState, useEffect} from 'react';
import { Layout, Table, Typography } from 'antd';
import SideBar from './components/SideBar';

const { Content, Sider } = Layout;
const { Title } = Typography;

const MangaPage = () => {
    const [state, setstate] = useState([]);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const getData = async() => {
        await axios.get(`https://api.mangadex.org/manga/${sessionStorage.getItem("mangaId")}/feed`, {
            params: {
                'translatedLanguage': ['en'],
                'order[chapter]': 'desc'
            }
        })
        .then(res => {
            setloading(false);
            setstate(res.data.results.map(row => ({
                Chapter: row.data.attributes.chapter,
                Title: row.data.attributes.title,
                ChapterId: row.data.id,
                GroupId: row.relationships[0].id
            })));
        });

        // for (const chapter of state) {
        //     await axios.get('https://api.mangadex.org/group', {
        //         params: { ids: [chapter.GroupId] }
        //     })
        //     .then(res => {
        //         setloading(false);
        //         chapter.GroupId = res.data.results[0].data.attributes.name;
        //     });
        // }
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
            width: 150
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
