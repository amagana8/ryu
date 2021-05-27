import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import { Menu } from 'antd';
import { DatabaseOutlined, BookOutlined, SearchOutlined, HistoryOutlined, NotificationOutlined, DownloadOutlined } from '@ant-design/icons';

export default class SideBar extends React.Component {
    render() {
        return ( 
            <div className="SideBar">
            <Menu
                mode="inline"
                style={{ width: 200 }}
                defaultSelectedKeys={[this.props.item]}
            >
                <Menu.Item key="1" icon={<DatabaseOutlined />}>
                <Link to="/">Library</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<BookOutlined />}>
                    <Link to="/mangaList">Manga List</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<SearchOutlined />}>
                <Link to="/browse">Search</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<HistoryOutlined />}>
                    History
                </Menu.Item>
                <Menu.Item key="5" icon={<NotificationOutlined />}>
                    Updates
                </Menu.Item>
                <Menu.Item key="6" icon={<DownloadOutlined />}>
                    Downloads
                </Menu.Item>
            </Menu>
            </div>
        );
    }
}