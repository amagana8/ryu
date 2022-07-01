import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './LoadingSpinner.module.scss';

const LoadingSpinner = () => (
    <Spin
    className={styles.spinner}
    indicator={<LoadingOutlined className={styles.circle} spin />}
  />
);

export { LoadingSpinner };
