import './styles/global.scss';
import { Tabs } from 'antd';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MangaList } from '@pages/mangaList/MangaList';

const { TabPane } = Tabs;

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Tabs tabPosition="left">
        <TabPane tab="Library" key="1">
          Library
        </TabPane>
        <TabPane tab="MangaList" key="2">
          <MangaList />
        </TabPane>
        <TabPane tab="Search" key="3">
          Search
        </TabPane>
        <TabPane tab="History" key="4">
          History
        </TabPane>
        <TabPane tab="Updates" key="5">
          Updates
        </TabPane>
        <TabPane tab="Downloads" key="6">
          Downloads
        </TabPane>
        <TabPane tab="Settings" key="7">
          Settings
        </TabPane>
      </Tabs>
    </ApolloProvider>
  );
}

export default App;
