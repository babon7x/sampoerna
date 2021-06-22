import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducers from './rootReducers';
import Routes from './Routes';

const store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(thunk))
)

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <Routes />
      </Provider>
    </HashRouter>
  );
}

export default App;
