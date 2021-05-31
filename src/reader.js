import axios from 'axios';
import { useState, useEffect } from 'react';
import { Layout, List } from 'antd';
import { SideBar } from './components/SideBar';

const { Content } = Layout;

const Reader = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const getData = async() => {
        const chapters = sessionStorage.getItem("chapterData").split(',');
        let images = [];
        let baseUrl = (await axios.get(`https://api.mangadex.org/at-home/server/${sessionStorage.getItem("chapterId")}`)).data.baseUrl;
        for (const chapter of chapters) {
            await axios.get(`${baseUrl}/data/${sessionStorage.getItem("chapterHash")}/${chapter}`).then(res => {
                images.push(res);
            });
        }
        setLoading(false);
        setState(images.map(row => ({
            Url: row.config.url
        })));
    }
    
    return(
        <div className="MangaPage">
            <Layout>
                <SideBar item='3'/>
                <Content>
                    <div>
                        {loading ? (
                            "Loading"
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
