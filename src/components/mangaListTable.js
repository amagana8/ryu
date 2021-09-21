import { useQuery, useMutation, gql } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { Table, Button, Select, Popover, InputNumber, Space, Form, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Option } = Select;

function MangaListTable(props) {
    const GET_LIST = gql`
        query($userName: String, $status: MediaListStatus) {
            MediaListCollection(userName: $userName, type: MANGA, sort:UPDATED_TIME_DESC, status: $status) {
                lists {
                    name
                    entries {
                        media {
                            title {
                                romaji
                            }
                            chapters
                        }
                        progress
                        score
                        id
                    }
                }
            }
        }    
    `;

    const { loading, error, data } = useQuery(GET_LIST, {
        variables: {
            userName: localStorage.getItem("username"),
            status: props.status
        }
    });

    const UPDATE_SCORE = gql`
        mutation ($id: Int, $score: Float) {
            SaveMediaListEntry (id: $id, score: $score) {
                id
                score
            }
        }
    `;

    const [updateScore] = useMutation(UPDATE_SCORE);

    const handleUpdateScore = (record) => (input) => {
        updateScore({
            variables: {
                id: record.Id,
                score: input
            }
        });
    }

    const UPDATE_PROGRESS = gql`
        mutation ($id: Int, $progress: Int) {
            SaveMediaListEntry (id: $id, progress: $progress) {
                id
                progress
            }
        }
    `;

    const [updateProgress] = useMutation(UPDATE_PROGRESS);

    const handleIncrementProgress = (record) => {
        updateProgress({
            variables: {
                id: record.Id,
                progress: record.Progress + 1
            }
        });
    }

    const handleupdateProgress = (record) => (input) => {
        updateProgress({
            variables: {
                id: record.Id,
                progress: input
            }
        });
    }

    const UPDATE_STATUS = gql`
        mutation ($id: Int, $status: MediaListStatus) {
            SaveMediaListEntry (id: $id, status: $status) {
                id
                status
            }
        }
    `;

    const [updateStatus] = useMutation(UPDATE_STATUS);

    const handleUpdateStatus = (record) => (input) => {
        updateStatus({
            variables: {
                id: record.Id,
                status: input
            }
        });
    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            width: 200
        },
        {
            title: 'Progress',
            dataIndex: ['Progress', 'Chapters'],
            width: 150,
            render: (text, record) => (
                <div style={{whiteSpace: 'pre'}}>
                    <Popover
                        title="Progress"
                        trigger="click"
                        content={
                            <div>
                                <Form>
                                    <Space direction="vertical">
                                        <Form.Item label="Chapters">
                                            <InputNumber defaultValue={record['Progress']} onChange={handleupdateProgress(record)}/>
                                        </Form.Item>
                                        <Form.Item label="Status">
                                            <Select defaultValue={props.status} onChange={handleUpdateStatus(record)}>
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
                        <Button type="text">{record.Chapters ? (`${record['Progress']}/${record['Chapters']}`.padEnd(7)) : (`${record['Progress']}`.padEnd(7))}</Button>
                    </Popover>
                    <Button type="link" onClick={() => handleIncrementProgress(record)} icon={<PlusOutlined style={{fontSize: 'small'}}/>} />
                </div>
            )
        },
        {
            title: 'Score',
            dataIndex: 'Score',
            width: 150,
            render: (text, record) => (
                <div>
                    <Select defaultValue={(record.Score) || ('-')} listHeight={320} onChange={handleUpdateScore(record)}>
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
            )
        }
    ];

    if(!localStorage.getItem("username")) {
        return(
            <Alert
                message="No AniList Account"
                description="Please go to settings and login with AniList to see your manga list."
                type="info"
                showIcon
            />
        );
    }

    if (loading) { 
        return <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
    }

    if (error) {
        return(
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
            />
        );
    }

    return(
        <div>
            <Table
                columns={columns}
                dataSource={data.MediaListCollection.lists[0].entries.map(row => ({
                    key: row.id,
                    Title: row.media.title.romaji,
                    Chapters:row.media.chapters,
                    Progress: row.progress,
                    Score: row.score,
                    Id: row.id
                }))}
                pagination={{ pageSize: 50 }}
            />
        </div>
    );
}

export { MangaListTable };
