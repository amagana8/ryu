import SideBar from './components/SideBar';
import { Layout, Tabs } from 'antd';
import { MangaListTable } from './mangaListTable';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

const MangaList = () => {
    return (
        <div className="MangaList">
          <Layout>
            <Sider>
                <SideBar item='2'/>
            </Sider>
            <Content>
              <Tabs type="card">
				        <TabPane tab="Reading" key="1">
                  <MangaListTable status='CURRENT'/>
                </TabPane>
                <TabPane tab="Completed" key="2">
                  <MangaListTable status='COMPLETED'/>
                </TabPane>
                <TabPane tab="Paused" key="3">
                  <MangaListTable status='PAUSED'/>
                </TabPane>
                <TabPane tab="Dropped" key="4">
                  <MangaListTable status='DROPPED'/>
                </TabPane>
                <TabPane tab="Planning" key="5">
                  <MangaListTable status='PLANNING'/>
                </TabPane>
              </Tabs>
            </Content>
          </Layout>
        </div>
      );
}

export default MangaList;
