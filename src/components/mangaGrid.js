import { useHistory } from 'react-router-dom';
import { Table, Button } from "antd";

function MangaGrid(props) {

    const history = useHistory();

    function handleClick(record) {
        sessionStorage.setItem("mangaId", record.Id);
        sessionStorage.setItem("mangaTitle", record.Title);
        sessionStorage.setItem("anilistId", record.AnilistId);
        history.push("/mangaPage");
    }
    
    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            width: 150,
            render:(text, record) => (
                <div><Button type="link" onClick={() => handleClick(record)}>{text}</Button></div>
            )
        }
    ];

    return(
        <div>
            <Table
                columns={columns}
                dataSource={props.data}
                pagination={{ pageSize: 50 }}
            />
        </div>
    );
}

export { MangaGrid };
