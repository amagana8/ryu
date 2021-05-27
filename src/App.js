import {Route, BrowserRouter as Router} from 'react-router-dom';
import {Switch} from 'react-router-dom';
import {withRouter} from 'react-router';
import MangaList from './mangaList';
import Browse from './browse';
import Library from './library';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// setup apollo client for anilist api calls
const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});

// setup page routing
const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
      <Route exact path="/" component={Library} />
      <Route exact path="/mangaList" component={withRouter(MangaList)} />
      <Route exact path="/browse" component={withRouter(Browse)} />
      </Switch>
    </Router>
  </ApolloProvider>
);


export default App;
