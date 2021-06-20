import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import MangaList from './mangaList';
import Browse from './browse';
import Library from './library';
import MangaPage from './mangaPage';
import Reader from './reader';
import Settings from './settings';
import History from './history';
import Updates from './updates';

// setup apollo client for graphql api calls
const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem("accessToken"),
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// setup page routing
const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route exact path="/" component={Library} />
        <Route exact path="/mangaList" component={withRouter(MangaList)} />
        <Route exact path="/browse" component={withRouter(Browse)} />
        <Route exact path="/history" component={withRouter(History)} />
        <Route exact path="/updates" component={withRouter(Updates)} />
        <Route exact path="/settings" component={withRouter(Settings)} />
        <Route exact path="/mangaPage" component={withRouter(MangaPage)} />
        <Route exact path="/reader" component={withRouter(Reader)} />
      </Switch>
    </Router>
  </ApolloProvider>
);


export default App;
