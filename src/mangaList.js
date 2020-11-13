import React, {useState, useEffect} from 'react';
import SideBar from './components/SideBar';
import './App.css';
import { Layout, Table } from 'antd';
import axios from 'axios';

const {Content, Sider } = Layout;

const MangaList = () => {
    const [state, setstate] = useState([]);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        await axios({
            url: 'https://graphql.anilist.co',
            method: 'post',
            data: {query: `
                    query {
                        MediaListCollection(userName: "PaleteroMan", type: MANGA) {
                            lists {
                                name
                                entries {
                                    media {
                                        title {
                                            romaji
                                        }
                                        chapters
                                    }
                                }
                            }
                        }
                    }    
                `
            }
        }).then(res => {
				setloading(false);
				setstate(
					res.data.data.MediaListCollection.lists[2].entries.map(row => ({
                        Title: row.media.title.romaji,
                        Chapters:row.media.chapters
                    }))
                );
            }
		);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "Title",
            width: 150
        },
        {
            title: "Chapters",
            dataIndex: "Chapters",
            width: 150
        }
    ];

    return (
        <div className="MangaList">
          <Layout>
            <Sider>
                <SideBar />
            </Sider>
            <Content>
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

export default MangaList;
