import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './App.css';
import './theme/variables.css';
import { AuthProvider } from './context/AuthProvider';
import LoginFC from './pages/Login/Login';
import SignupFC from './pages/Signup/Signup';
import ForgotPasswordFC from './pages/ForgotPassword/ForgotPassword';
import PrivateRoute from './route/PrivateRoute';
import BooksNeededFC from './pages/BooksNeeded/BooksNeeded';
import BooksGivenFC from './pages/BooksGiven/BooksGiven';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={LoginFC} exact={true} />
            <Route path="/signup" component={SignupFC} exact={true} />
            <Route path="/forgot-password" component={ForgotPasswordFC} exact={true} />
            <PrivateRoute path="/need" component={BooksNeededFC} exact={true} />
            <PrivateRoute path="/give" component={BooksGivenFC} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/need" />} />
            <Route exact path="/home" render={() => <Redirect to="/need" />} />
          </Switch>
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
