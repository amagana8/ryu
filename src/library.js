import { useState, useEffect } from 'react';
import { SideBar } from './components/SideBar';
import { Layout, Spin } from 'antd';
import { MangaGrid } from './components/mangaGrid';
import { db } from './components/db';
import { LoadingOutlined } from '@ant-design/icons';

const { Content } = Layout;

const Library = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);
    
    const getData = async() => {
        await db.table("library").toArray().then(res => {
            setState(res.map(row => ({
                Title: row.title,
                Id: row.id,
                AniListId: row.anilistId,
                CoverId: row.coverId
            })));
            setLoading(false);
        });
    }
    
    return (
        <div className="App">
            <Layout>
                <SideBar item='1'/>
                <Content>
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

export default Library;
