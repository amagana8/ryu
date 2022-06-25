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
  Spin,
  Alert,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { GetList } from '@graphql/queries';
import { UpdateProgress, UpdateScore, UpdateStatus } from '@graphql/mutations';
import { Status } from '@utils/enums';

const { Option } = Select;

interface mangaTableProps {
  status: Status;
}

function MangaTable({ status }: mangaTableProps) {
  const { loading, error, data } = useQuery(GetList, {
    variables: {
      userName: localStorage.getItem('username'),
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
      dataIndex: 'Title',
      width: 200,
    },
    {
      title: 'Progress',
      dataIndex: ['Progress', 'Chapters'],
      width: 150,
      render: (text: any, record: any) => (
        <div style={{ whiteSpace: 'pre' }}>
          <Popover
            title="Progress"
            trigger="click"
            content={
              <div>
                <Form>
                  <Space direction="vertical">
                    <Form.Item label="Chapters">
                      <InputNumber
                        defaultValue={record['Progress']}
                        onChange={handleupdateProgress(record)}
                      />
                    </Form.Item>
                    <Form.Item label="Status">
                      <Select
                        defaultValue={status}
                        onChange={handleUpdateStatus(record)}
                      >
                        <Option value="CURRENT">Reading</Option>
                        <Option value="COMPLETED">Completed</Option>
                        <Option value="PAUSED">Paused</Option>
                        <Option value="DROPPED">Dropped</Option>
                        <Option value="PLANNING">Planning</Option>
                      </Select>
                    </Form.Item>
                  </Space>
                </Form>
              </div>
            }
          >
            <Button type="text">
              {record.Chapters
                ? `${record['Progress']}/${record['Chapters']}`.padEnd(7)
                : `${record['Progress']}`.padEnd(7)}
            </Button>
          </Popover>
          <Button
            type="link"
            onClick={() => handleIncrementProgress(record)}
            icon={<PlusOutlined style={{ fontSize: 'small' }} />}
          />
        </div>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'Score',
      width: 150,
      render: (text: any, record: any) => (
        <div>
          <Select
            defaultValue={record.Score || '-'}
            listHeight={320}
            onChange={handleUpdateScore(record)}
          >
            <Option value="0">-</Option>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
          </Select>
        </div>
      ),
    },
  ];

  if (!localStorage.getItem('username')) {
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
    return (
      <Spin
        style={{ display: 'grid', justifyContent: 'center' }}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      />
    );
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
    <div>
      <Table
        columns={columns}
        dataSource={
          data.MediaListCollection.lists[0]
            ? data.MediaListCollection.lists[0].entries.map((row: any) => ({
                key: row.id,
                Title: row.media.title.romaji,
                Chapters: row.media.chapters,
                Progress: row.progress,
                Score: row.score,
                Id: row.id,
              }))
            : []
        }
        pagination={{ pageSize: 50 }}
      />
    </div>
  );
}

export { MangaTable };
