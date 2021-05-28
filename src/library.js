import SideBar from './components/SideBar';
import { Layout } from 'antd';

const {Content, Sider } = Layout;

const Library = () => {
    return (
      <div className="App">
        <Sider>
          <SideBar item='1'/>
        </Sider>
        <Content>
          <p>Library Here</p>
        </Content>
      </div>
    );
  }

export default Library;