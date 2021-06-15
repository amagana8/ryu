import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { List, Card, Button, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const { Meta } = Card;

function MangaGrid(props) {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getData();
    }, [props.data]);


    const history = useHistory();

    const getData = async() => {
        for (const manga of props.data) {
            if (manga.CoverId) {
                await axios.get(`https://api.mangadex.org/cover/${manga.CoverId}`).then(res => {
                    manga.Cover = `https://uploads.mangadex.org/covers/${manga.Id}/${res.data.data.attributes.fileName}`;
                });
            } else {
                manga.Cover = '#';
            }
        }
        setState(props.data);
        setLoading(false);
    }

    function handleClick(record) {
        sessionStorage.setItem("mangaId", record.Id);
        sessionStorage.setItem("mangaTitle", record.Title);
        sessionStorage.setItem("coverId", record.CoverId);
        history.push("/mangaPage");
    }

    return(
        <div>
            {loading ? (
                <Spin style={{display: 'grid', justifyContent: 'center'}} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : (
                <List
                    grid={{
                        gutter: [16, 48],
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    style={{maxWidth: '98%'}}
                    dataSource={state}
                    renderItem={item => (
                        <Button type="text" onClick={() => handleClick(item)}>
                            <List.Item>
                                <Card
                                    loading={loading}
                                    hoverable
                                    style={{ width: 240 }}
                                    cover={<img style={{height: 360}} src={item.Cover} />}
                                >
                                    <Meta title={item.Title} />
                                </Card>
                            </List.Item>
                        </Button>
                    )}
                />
            )}
        </div>
    );
}

export { MangaGrid };
