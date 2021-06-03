import { useState, useEffect } from 'react';
import { SideBar } from './components/SideBar';
import { Layout } from 'antd';
import { MangaGrid } from './components/mangaGrid';
import { db } from './components/db';

const { Content } = Layout;

const Library = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getData();
    }, []);
    
    const getData = async() => {
        await db.table("library").toArray().then(res => {
            setLoading(false);
            setState(res.map(row => ({
                Title: row.title,
                Id: row.id
            })));
        });
    }
    
    return (
        <div className="App">
            <Layout>
                <SideBar item='1'/>
                <Content>
                    <div>
                    {loading ? (
                        "Loading"
                    ) : (
                        <MangaGrid data={state}/>
                    )}
                    </div>
                </Content>
            </Layout>
        </div>
    );
}

export default Library;
