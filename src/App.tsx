import './styles/global.scss';
import { Layout } from 'antd';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MangaList } from '@pages/mangaList/MangaList';
import { Settings } from '@pages/settings/Settings';
import { useEffect, useMemo, useState } from 'react';
import { getStoredUser, loadStore, updateUser } from '@services/userStore';
import { defaultUser, UserContext } from 'contexts/UserContext';
import { SideBar } from '@components/sideBar/SideBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Library } from '@pages/library/Library';
import { Search } from '@pages/search/Search';
import { MangaPage } from '@pages/mangaPage/MangaPage';
import { History } from '@pages/history/History';
import { conenct } from '@services/db';
import { Downloads } from '@pages/downloads/Downloads';
import { Updates } from '@pages/updates/Updates';
import { Reader } from '@pages/reader/Reader';
import { fetch, Body } from '@tauri-apps/api/http';

const { Sider, Content } = Layout;

function App() {
  const [user, setUser] = useState(defaultUser);
  const defaultValue = { user, setUser };

  // load data from store on startup
  useEffect(() => {
    const getUser = async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    };
    const loadStorage = async () => {
      await loadStore();
      await conenct();
    };
    const refreshMdToken = async () => {
      if (!user.mdRefreshToken) return;

      try {
        const { data } = await fetch<any>(
          'https://api.mangadex.org/auth/refresh',
          {
            method: 'POST',
            body: Body.json({
              token: user.mdRefreshToken,
            }),
          },
        );
        setUser((prevState) => ({
          ...prevState,
          mdSessionToken: data.token.session,
          mdRefreshToken: data.token.refresh,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    loadStorage();
    getUser();
    refreshMdToken();
  }, []);

  // keep store in sync with context
  useEffect(() => {
    if (user !== defaultUser) {
      updateUser(user);
    }
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
                <Route path="/reader" element={<Reader />} />
                <Route path="/history" element={<History />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="/downloads" element={<Downloads />} />
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
