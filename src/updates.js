import axios from 'axios';
import { useState, useEffect } from 'react';
import { SideBar } from './components/SideBar';
import { Layout, Spin, Table, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


const { Content } = Layout;

const Updates = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const getData = async() => {
        const feed = await axios.get('https://api.mangadex.org/user/follows/manga/feed', {
            headers: {
                'Authorization': localStorage.getItem("mdToken")
            },
            params: {
                'translatedLanguage': ['en'],
                'order[updatedAt]': 'desc'

            }
        }).catch(error => {
            message.error('Could not retrieve list. Please ensure you are logged into Mangadex.');
            console.log(error);
        });

        if (feed) {
            const feedData = (feed.data.results.map((row, index) => ({
                key: index,
                Manga: row.relationships.find(rel => rel.type==='manga').id,
                Chapter: row.data.attributes.chapter
            })));
            for (const chapter of feedData) {
                await axios.get(`https://api.mangadex.org/manga/${chapter.Manga}`).then(res => {
                    chapter.Manga = res.data.data.attributes.title.en;
                });
            }
            setState(feedData);
        }
        setLoading(false);
    }

    const columns = [
        {
            title: 'Manga',
            dataIndex: 'Manga',
            width: 150
        },
        {
            title: 'Chapter',
            dataIndex: 'Chapter',
            width: 150
        }
    ];

    return(
        <div>
            <Layout>
                <SideBar item='5'/>
                <Content>
                    <div>
                        {loading ? (
                            <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <Table
                                dataSource={state}
                                columns={columns}
                                pagination={{ pageSize: 50 }}
                            />
                        )}
                    </div>
                </Content>
            </Layout>
        </div>
    )
}

export default Updates;