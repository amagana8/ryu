import './styles/global.scss';
import { Layout } from 'antd';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MangaList } from '@pages/mangaList/MangaList';
import { Settings } from '@pages/settings/Settings';
import { useEffect, useMemo, useState } from 'react';
import { userStore } from 'userStore';
import { defaultUser, UserContext } from 'contexts/UserContext';
import { SideBar } from '@components/sideBar/SideBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Library } from '@pages/library/Library';
import { Search } from '@pages/search/Search';
import { MangaPage } from '@pages/mangaPage/MangaPage';
import { History } from '@pages/history/History';
import { conenct } from '@services/db';

const { Sider, Content } = Layout;

function App() {
  const [user, setUser] = useState(defaultUser);
  const defaultValue = { user, setUser };

  // load data from store on startup
  useEffect(() => {
    const getUser = async () => {
      const anilistId = (await userStore.get('anilistId')) as string;
      const anilistToken = (await userStore.get('anilistToken')) as string;
      const mangadexToken = (await userStore.get('mangadexToken')) as string;

      setUser({
        anilistId,
        anilistToken,
        mangadexToken,
      });
    };
    const loadDb = async () => {
      await conenct();
    }
    loadDb();
    getUser();
  }, []);

  // keep store in sync with context
  useEffect(() => {
    const updateStore = async () => {
      await userStore.set('anilistId', user.anilistId);
      await userStore.set('anilistToken', user.anilistToken);
      await userStore.set('mangadexToken', user.mangadexToken);
    };
    updateStore();
  }, [user]);

  // update apollo client whenver token changes
  const client = useMemo(() => {
    return new ApolloClient({
      uri: 'https://graphql.anilist.co',
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${user.anilistToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }, [user.anilistToken]);

  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <UserContext.Provider value={defaultValue}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Layout>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={onCollapse}
              className="sideBar"
            >
              <SideBar />
            </Sider>
            <Content>
              <Routes>
                <Route path="/" element={<Library />} />
                <Route path="/mangaList" element={<MangaList />} />
                <Route path="/search" element={<Search />} />
                <Route path="/mangaPage" element={<MangaPage />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Content>
          </Layout>
        </BrowserRouter>
      </ApolloProvider>
    </UserContext.Provider>
  );
}

export default App;
