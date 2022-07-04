import { fetch, Body } from '@tauri-apps/api/http';
import { useContext, useState } from 'react';
import { Typography, Form, Input, Button, Space, Modal, message } from 'antd';
import { GithubFilled, HeartFilled } from '@ant-design/icons';
import { config } from '../../config';
import { UserContext } from '@contexts/UserContext';
import jwt_decode from 'jwt-decode';
import styles from './Settings.module.scss';

const { Title } = Typography;
const { TextArea } = Input;

const Settings = () => {
  // form input layout
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  // form button layout
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const { user, setUser } = useContext(UserContext);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = (input: any) => {
    const payload = jwt_decode(input.token) as any;
    setUser((prevState) => ({
      ...prevState,
      anilistId: payload.sub,
      anilistToken: input.token,
    }));
    setIsModalVisible(false);
    message.success('Anislist connected!');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const mdOnFinish = async (input: any) => {
    try {
      const { data } = await fetch<any>('https://api.mangadex.org/auth/login', {
        method: 'POST',
        body: Body.json({
          username: input.username,
          password: input.password,
        }),
      });
      setUser((prevState) => ({
        ...prevState,
        mangadexToken: data.token.session,
      }));
      message.success('Login successful!');
    } catch (error) {
      message.error('Login failed, please try again.');
      console.log(error);
    }
  };

  return (
    <>
      <Title level={2} className={styles.title}>
        Connect with AniList
      </Title>
      <div className={styles.button}>
        <Button
          type="primary"
          href={`https://anilist.co/api/v2/oauth/authorize?client_id=${config.client_id}&response_type=token`}
          onClick={showModal}
          target="_blank"
        >
          {user.anilistToken ? 'Re-Authorize' : 'Authorize'}
        </Button>
      </div>
      <Modal
        title="Please enter the code given after logging into AniList"
        visible={isModalVisible}
        footer={[
          <Button onClick={handleCancel}>Cancel</Button>,
          <Button
            type="primary"
            form="tokenForm"
            key="submit"
            htmlType="submit"
          >
            Submit
          </Button>,
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
      <Title level={2} className={styles.title}>
        Connect with MangaDex
      </Title>
      <Form {...layout} onFinish={mdOnFinish} className={styles.form}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
      <Title level={2} className={styles.title}>
        External Links
      </Title>
      <div className={styles.button}>
        <Space>
          <Button
            type="primary"
            href="https://github.com/amagana8/ryu"
            target="_blank"
            icon={<GithubFilled />}
            className={styles.github}
          >
            Github
          </Button>
          <Button
            type="primary"
            href="https://ko-fi.com/amagana8"
            target="_blank"
            icon={<HeartFilled />}
            className={styles.kofi}
          >
            Support Me
          </Button>
        </Space>
      </div>
    </>
  );
};

export { Settings };
