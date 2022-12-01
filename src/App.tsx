import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { peopleOutline, barChartOutline, calendarOutline, informationCircle } from 'ionicons/icons';
import Sessions from './pages/Sessions';
import Patients from './pages/Patients';
import Reports from './pages/Reports';

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
import './theme/variables.css';
import ManageSessions from './pages/ManageSessions';
import ManagePatients from './pages/ManagePatients';
import ViewSession from './pages/ViewSession';
import ViewPatient from './pages/ViewPatient';

import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import Info from './pages/Info';

setupIonicReact();

process.env.REACT_GOOGLE_TRACKING_ID && ReactGA.initialize(process.env.REACT_GOOGLE_TRACKING_ID);

const App: React.FC = () => {
  useEffect(() => {
    // Send pageview with path
    ReactGA.send({ hitType: "pageview", page: (window.location.pathname + window.location.search) });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/sessions">
              <Sessions />
            </Route>
            <Route exact path="/patients">
              <Patients />
            </Route>
            <Route exact path="/managesession">
              <ManageSessions />
            </Route>
            <Route path="/managesession/:id">
              <ManageSessions />
            </Route>
            <Route path="/viewsession/:id">
              <ViewSession />
            </Route>
            <Route exact path="/managepatient">
              <ManagePatients />
            </Route>
            <Route path="/managepatient/:id">
              <ManagePatients />
            </Route>
            <Route path="/viewpatient/:id">
              <ViewPatient />
            </Route>            
            <Route exact path="/">
              <Redirect to="/sessions" />
            </Route>
            <Route path="/reports">
              <Reports />
            </Route>
            <Route path="/info">
              <Info />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="sessions" href="/sessions">
              <IonIcon icon={calendarOutline} />
              <IonLabel>Sessions</IonLabel>
            </IonTabButton>
            <IonTabButton tab="patients" href="/patients">
              <IonIcon icon={peopleOutline} />
              <IonLabel>Patients</IonLabel>
            </IonTabButton>
            <IonTabButton tab="reports" href="/reports">
              <IonIcon icon={barChartOutline} />
              <IonLabel>Reports</IonLabel>
            </IonTabButton>
            <IonTabButton tab="info" href="/info">
              <IonIcon icon={informationCircle} />
              <IonLabel>Info</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
