import axios from 'axios';
import { useState, useEffect } from 'react';
import { SideBar } from './components/SideBar';
import { Layout, Input } from 'antd';
import { MangaGrid } from './components/mangaGrid';

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
            setState(res.data.results.map(row => ({
                Title: row.data.attributes.title.en,
                Id: row.data.id
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

export default Browse;
