import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducers from './rootReducers';
import Routes from './Routes';

export const store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(thunk))
)

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: lightBlue[500]
    }
  },
  typography: {
    fontFamily: 'Nunito Sans Regular'
  }
});

function App() {
  return (
    <HashRouter>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Routes />
        </ThemeProvider>
      </Provider>
    </HashRouter>
  );
}

export default App;
