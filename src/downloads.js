import { SideBar } from './components/SideBar';
import { Layout } from 'antd';

const { Content } = Layout;

const Downloads = () => {
    return(
        <div>
            <Layout>
                <SideBar item='6' />
                <Content>
                    Downloads coming soon!
                </Content>
            </Layout>
        </div>
    );
}

export default Downloads;