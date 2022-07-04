import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DatabaseOutlined,
  BookOutlined,
  SearchOutlined,
  HistoryOutlined,
  NotificationOutlined,
  DownloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const SideBar = () => {
  const items = [
    {
      key: 'library',
      label: <Link to="/">Library</Link>,
      icon: <DatabaseOutlined />,
    },
    {
      key: 'list',
      label: <Link to="/mangaList">Manga List</Link>,
      icon: <BookOutlined />,
    },
    {
      key: 'search',
      label: <Link to="/search">Search</Link>,
      icon: <SearchOutlined />,
    },
    {
      key: 'history',
      label: <Link to="/history">History</Link>,
      icon: <HistoryOutlined />,
    },
    {
      key: 'updates',
      label: <Link to="/updates">Updates</Link>,
      icon: <NotificationOutlined />,
    },
    {
      key: 'downloads',
      label: <Link to="/downloads">Downloads</Link>,
      icon: <DownloadOutlined />,
    },
    {
      key: 'settings',
      label: <Link to="/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
  ];

  return <Menu mode="inline" items={items} />;
};

export { SideBar };
