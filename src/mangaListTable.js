import { useQuery } from '@apollo/client';
import { PlusOutlined } from '@ant-design/icons';
import { gql } from '@apollo/client';
import { Table, Button } from 'antd';

export function MangaListTable(props) {
    const GET_LIST= gql`
        query($status: MediaListStatus) {
            MediaListCollection(userName: "PaleteroMan", type: MANGA, sort:UPDATED_TIME_DESC, status: $status) {
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
                    }
                }
            }
        }    
    `;

    const { loading, error, data } = useQuery(GET_LIST, {
        variables: {status: props.status}
    });

    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            width: 150
        },
        {
            title: 'Progress',
            dataIndex: ['Progress', 'Chapters'],
            width: 150,
            render: (text, record) => (
                <div>{record['Progress']} <Button icon={<PlusOutlined />}></Button></div>
            )
        },
        {
            title: 'Score',
            dataIndex: 'Score',
            width: 150
        }
    ];

    if (loading) { 
        return <p>Loading</p>;
    }

    if (error) {
        return <p>Error! ${error}</p>;
    }

    return(
        <div>
            <Table
                columns={columns}
                dataSource={data.MediaListCollection.lists[0].entries.map(row => ({
                    Title: row.media.title.romaji,
                    Chapters:row.media.chapters,
                    Progress: row.progress,
                    Score: row.score,
                }))}
                pagination={{ pageSize: 50 }}
            />
        </div>
    );
}
