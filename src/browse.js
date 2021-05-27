import SideBar from './components/SideBar';
import './App.css';
import { Layout, Input } from 'antd';
import axios from 'axios';

const {Content, Sider } = Layout;
const { Search } = Input;

const onSearch = async(value) => {
    let url = "https://mangadex.org/search?title="+value;
    await axios.get(url,{
        headers: { 'Access-Control-Allow-Origin': true },
        mode: 'cors',
      }).then(res => { 
            console.log(res); 
        } 
    ); 
}

const Browse = () => {
    return(
        <div className="App">
            <Sider>
                <SideBar item='3'/>
            </Sider>
            <Content>
                <Search
                    placeholder="search MangaDex"
                    onSearch={onSearch}
                    style={{ width: 200 }}
                />
            </Content>
        </div>
    );
}

export default Browse;
