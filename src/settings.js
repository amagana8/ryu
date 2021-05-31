import { useState } from 'react';
import { SideBar } from './components/SideBar';
import { Layout, Typography, Form, Input, Button, Space, Modal } from 'antd';
import { GithubFilled, HeartFilled } from '@ant-design/icons';
import { config } from './config';

const { Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const Settings = () => {

    // get api client id from external file
    const client_id = config.client_id;
    
    // form input layout
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // form button layout
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    const onFinish = (input) => {
        localStorage.setItem("username", input.username);
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const showModal = () => {
        setIsModalVisible(true);
    };
    
    const handleSubmit = (input) => {
        localStorage.setItem("accessToken", input.token);
        setIsModalVisible(false);
    };
    
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return(
        <div className="MangaPage">
            <Layout>
                <SideBar item='7'/>
                <Content>
                    <br />
                    <Title style={{ textAlign: 'center' }}>Connect with AniList</Title>
                    <Form
                        {...layout}
                        style={{width: '75%'}}
                        id="usernameForm"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input defaultValue={localStorage.getItem("username")}/>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Space>
                                <Button
                                    type="primary"
                                    size="large"
                                    form="usernameForm"
                                    key="submit"
                                    htmlType="submit"
                                >
                                    Save Username
                                </Button>
                                <Button
                                    type="link"
                                    href={`https://anilist.co/api/v2/oauth/authorize?client_id=${client_id}&response_type=token`}
                                    onClick={showModal}
                                    target="_blank"
                                    size="large"
                                    style={{color: 'white', background: '#1890ff'}}
                                >
                                    Authorize
                                </Button>
                            </Space>
                            <Modal
                                title="Please enter the code given after logging into AniList"
                                visible={isModalVisible}
                                footer={[
                                    <Button onClick={handleCancel}>
                                        Cancel
                                    </Button>,
                                    <Button type="primary" form="tokenForm" key="submit" htmlType="submit">
                                        Submit
                                    </Button>
                                ]}
                            >
                                <Form id="tokenForm" onFinish={handleSubmit}>
                                    <Form.Item
                                        name="token"
                                        rules={[{ required: true, message: 'Please input your code!' }]}
                                    >
                                        <TextArea rows={6} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Form.Item>
                        <br />
                        <Form.Item {...tailLayout}>
                            <Title>External Links</Title>
                            <Space>
                                <Button
                                    type="link"
                                    href="https://github.com/amagana8/ryu"
                                    target="_blank"
                                    icon={<GithubFilled/>}
                                    size="large"
                                    style={{
                                        color: 'white',
                                        background: '#8c8c8c',
                                        border: 'black'
                                    }}
                                >
                                    Github
                                </Button>
                                <Button
                                    type="link"
                                    href="https://ko-fi.com/amagana8"
                                    target="_blank"
                                    icon={<HeartFilled/>}
                                    size="large"
                                    style={{
                                        color: 'white',
                                        background: '#ff5e5b',
                                        border: 'black'
                                    }}
                                >
                                    Support Me
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </div>
    );
}

export default Settings;
