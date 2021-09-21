import axios from 'axios';
import { useState, useEffect } from 'react';
import { SideBar } from './components/SideBar';
import { Layout, Input, Spin } from 'antd';
import { MangaGrid } from './components/mangaGrid';
import { LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Search } = Input;

const Browse = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const getData = async(value) => {
        await axios.get('https://api.mangadex.org/manga', {
            params: {title: value}
        }).then(res => {
            setLoading(false);
            setState(res.data.data.map(row => ({
                Title: row.attributes.title.en || row.attributes.title.jp,
                Id: row.id,
                CoverId: row.relationships.find(rel => rel.type==='cover_art').id || null
            })));
        }); 
    }

    return(
        <div className="Browse">
            <Layout>
                <SideBar item='3'/>
                <Content>
                    <Search
                        placeholder="search MangaDex"
                        onSearch={getData}
                    />
                    <div>
                        {loading ? (
                            <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <MangaGrid key={state} data={state}/>
                        )}
                    </div>
                </Content>
            </Layout>
        </div>
    );
}

export default Browse;
