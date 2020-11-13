import './App.css';
import SideBar from './components/SideBar';

import {Route, BrowserRouter as Router} from 'react-router-dom';
import {Switch} from 'react-router-dom';
import {withRouter} from 'react-router';
import MangaList from './mangaList';
import { Layout } from 'antd';

const {Content, Sider } = Layout;

const App = () => (
  <Router>
    <Switch>
    <Route exact path="/" component={Library} />
    <Route exact path="/mangaList" component={withRouter(MangaList)} />
    </Switch>
  </Router>
);

function Library() {
  return (
    <div className="App">
      <Sider>
        <SideBar />
      </Sider>
      <Content>
        <p>Library Here</p>
      </Content>
    </div>
  );
}

export default App;
