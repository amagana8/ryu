import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import SideBar from './components/SideBar';
import { Layout, Input, Table, Button } from 'antd';
import axios from 'axios';

const { Content, Sider } = Layout;
const { Search } = Input;

const Browse = () => {
    const [state, setstate] = useState([]);
    const [loading, setloading] = useState(true);
    useEffect(() => {
        getData();
    }, []);

    const history = useHistory();

    const getData = async(value) => {
        await axios.get('https://api.mangadex.org/manga', {
            params: {title: value}
        }).then(res => { 
            setloading(false);
            setstate(res.data.results.map(row => ({
                Title: row.data.attributes.title.en,
                Id: row.data.id
            })));
        }); 
    }

    function handleClick(record) {
        sessionStorage.setItem("mangaId", record.Id);
        sessionStorage.setItem("mangaTitle", record.Title);
        history.push("/mangaPage");
    }

    const columns = [
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
        <div className="Browse">
            <Layout>
                <Sider>
                    <SideBar item='3'/>
                </Sider>
                <Content>
                    <Search
                        placeholder="search MangaDex"
                        onSearch={getData}
                    />
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

export default Browse;
