import SideBar from './components/SideBar';
import { Layout } from 'antd';

const { Content } = Layout;

const Library = () => {
    return (
      <div className="App">
        <SideBar item='1'/>
        <Content>
          <p>Library Here</p>
        </Content>
      </div>
    );
  }

export default Library;