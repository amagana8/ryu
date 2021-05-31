import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Layout } from 'antd';
import {
    DatabaseOutlined,
    BookOutlined,
    SearchOutlined,
    HistoryOutlined,
    NotificationOutlined,
    DownloadOutlined,
    SettingOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

class SideBar extends React.Component {
    state = {
        collapsed: false,
    };
    
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render() {
        const { collapsed } = this.state;
        return ( 
            <div className="SideBar">
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={this.onCollapse}
                    style={{
                        backgroundColor: '#141414',
                        overflow: 'auto',
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        left: 0
                    }}
                >
                    <Menu
                        mode="inline"
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
                        <Menu.Item key="7" icon={<SettingOutlined />}>
                            <Link to="/settings">Settings</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
            </div>
        );
    }
}

export { SideBar };
