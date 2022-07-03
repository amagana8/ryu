import { useQuery, useMutation } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import {
  Table,
  Button,
  Select,
  Popover,
  InputNumber,
  Space,
  Form,
  Alert,
} from 'antd';
import { GetList } from '@graphql/queries';
import { UpdateProgress, UpdateScore, UpdateStatus } from '@graphql/mutations';
import { Status } from '@utils/enums';
import { useContext } from 'react';
import { UserContext } from '@contexts/UserContext';
import styles from './MangaTable.module.scss';
import { LoadingSpinner } from '@components/loadingSpinner/LoadingSpinner';

const { Option } = Select;

interface mangaTableProps {
  status: Status;
}

function MangaTable({ status }: mangaTableProps) {
  const { user } = useContext(UserContext);

  const { loading, error, data } = useQuery(GetList, {
    variables: {
      userId: user.anilistId,
      status,
    },
  });

  const [updateScore] = useMutation(UpdateScore);

  const handleUpdateScore = (record: any) => (input: any) => {
    updateScore({
      variables: {
        id: record.Id,
        score: input,
      },
    });
  };

  const [updateProgress] = useMutation(UpdateProgress);

  const handleIncrementProgress = (record: any) => {
    updateProgress({
      variables: {
        id: record.Id,
        progress: record.Progress + 1,
      },
    });
  };

  const handleupdateProgress = (record: any) => (input: any) => {
    updateProgress({
      variables: {
        id: record.Id,
        progress: input,
      },
    });
  };

  const [updateStatus] = useMutation(UpdateStatus);

  const handleUpdateStatus = (record: any) => (input: any) => {
    updateStatus({
      variables: {
        id: record.Id,
        status: input,
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: 'Progress',
      dataIndex: ['progress', 'chapters'],
      width: 150,
      render: (text: any, record: any) => (
        <div className={styles.progress}>
          <Popover
            title="Progress"
            trigger="click"
            content={
              <Form>
                <Space direction="vertical">
                  <Form.Item label="Chapters">
                    <InputNumber
                      defaultValue={record.progress}
                      onChange={handleupdateProgress(record)}
                    />
                  </Form.Item>
                  <Form.Item label="Status">
                    <Select
                      defaultValue={status}
                      onChange={handleUpdateStatus(record)}
                    >
                      <Option value={Status.Current}>Reading</Option>
                      <Option value={Status.Completed}>Completed</Option>
                      <Option value={Status.Paused}>Paused</Option>
                      <Option value={Status.Dropped}>Dropped</Option>
                      <Option value={Status.Planning}>Planning</Option>
                    </Select>
                  </Form.Item>
                </Space>
              </Form>
            }
          >
            <Button type="text">
              {record.chapters
                ? `${record.progress}/${record.chapters}`.padEnd(7)
                : `${record.progress}`.padEnd(7)}
            </Button>
          </Popover>
          <Button
            type="link"
            onClick={() => handleIncrementProgress(record)}
            icon={<PlusOutlined className={styles.plus} />}
          />
        </div>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      width: 150,
      render: (text: any, record: any) => (
        <Select
          defaultValue={record.Score || '-'}
          listHeight={320}
          onChange={handleUpdateScore(record)}
        >
          {[...Array(11).keys()].map((num) => (
            <Option value={num} key={num}>
              {num === 0 ? '-' : num}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  if (!user.anilistId) {
    return (
      <Alert
        message="No AniList Account"
        description="Please go to settings and login with AniList to see your manga list."
        type="info"
        showIcon
      />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Table
      className={styles.table}
      columns={columns}
      dataSource={
        data.MediaListCollection.lists[0]
          ? data.MediaListCollection.lists[0].entries.map((row: any) => ({
              key: row.id,
              title: row.media.title.romaji,
              chapters: row.media.chapters,
              progress: row.progress,
              score: row.score,
              id: row.id,
            }))
          : []
      }
      pagination={{ pageSize: 50 }}
    />
  );
}

export { MangaTable };
