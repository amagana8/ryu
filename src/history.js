import { gql, useQuery } from '@apollo/client';
import { Layout, Spin, Table } from 'antd';
import { SideBar } from './components/SideBar';
import { LoadingOutlined } from '@ant-design/icons';
import { DateTime } from 'luxon';

const { Content } = Layout;

const History = () => {

    const GET_HISTORY = gql`
        query($userId: Int) {
            Page {
                activities(userId: $userId, type_in: MANGA_LIST, sort: ID_DESC) {
                    ... on ListActivity {
                        progress
                        createdAt
                        media {
                            title {
                                romaji
                            }
                        }
                    }
                }
            }
        }
    `;

    const { loading, data } = useQuery(GET_HISTORY, {
        variables: {
            userId: localStorage.getItem("UserId")
        }
    });

    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            width: 150
        },
        {
            title: 'Chapter',
            dataIndex: 'Progress',
            width: 150
        },
        {
            title: 'Date',
            dataIndex: 'Date',
            width: 150
        }
    ];

    return (
        <div className="App">
            <Layout>
                <SideBar item='4'/>
                <Content>
                    <div>
                        {loading ? (
                            <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={data.Page.activities.map(row => ({
                                    Title: row.media.title.romaji,
                                    Progress: row.progress,
                                    Date: DateTime.fromSeconds(row.createdAt).toFormat('DDD t')
                                }))}
                                pagination={{pageSize: 50}}
                            />
                        )}
                    </div>
                </Content>
            </Layout>
        </div>
    );
}

export default History;
