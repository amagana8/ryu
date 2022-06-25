import { Tabs } from 'antd';
import { MangaTable } from '@components/mangaTable/MangaTable';
import { Status } from '@utils/enums';

const { TabPane } = Tabs;

const MangaList = () => (
  <Tabs type="card">
    <TabPane tab="Reading" key={Status.Reading}>
      <MangaTable status={Status.Reading} />
    </TabPane>
    <TabPane tab="Completed" key={Status.Completed}>
      <MangaTable status={Status.Completed} />
    </TabPane>
    <TabPane tab="Paused" key={Status.Paused}>
      <MangaTable status={Status.Paused} />
    </TabPane>
    <TabPane tab="Dropped" key={Status.Dropped}>
      <MangaTable status={Status.Dropped} />
    </TabPane>
    <TabPane tab="Planning" key={Status.Planning}>
      <MangaTable status={Status.Planning} />
    </TabPane>
  </Tabs>
);

export { MangaList };
