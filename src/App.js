import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { Provider } from 'react-redux';
import { HashRouter } from "react-router-dom";
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducers from './rootReducers';
import Routes from './Routes';
import { setLoggedIn } from './actions/auth';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
//import LogRocket from 'logrocket';

//LogRocket.init('unkcd0/hm-sampoerna');

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
    fontFamily: 'Nunito Sans Regular',
    button: {
      fontWeight: 'bold'
    }
  }
});

if(localStorage[process.env.REACT_APP_LS_NAME]){
  const user  = JSON.parse(localStorage[process.env.REACT_APP_LS_NAME]);
  store.dispatch(setLoggedIn(user));
}

function App() {
  return (
    <HashRouter>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </Provider>
      </MuiPickersUtilsProvider>
    </HashRouter>
  );
}

export default App;
