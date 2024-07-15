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
import { peopleOutline, barChartOutline, calendarOutline, informationCircle, barbellOutline, helpCircleOutline, bodyOutline, medal } from 'ionicons/icons';

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

import Patients from './pages/Patients';
import ManagePatients from './pages/ManagePatients';
import ViewPatient from './pages/ViewPatient';

import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import Info from './pages/Info';
import { useDataFromGoogleSheet } from './utils';
import PatientSummary from './pages/PatientSummary';

setupIonicReact();

process.env.REACT_APP_GOOGLE_TRACKING_ID && ReactGA.initialize(process.env.REACT_APP_GOOGLE_TRACKING_ID);

const App: React.FC = () => {
  useEffect(() => {
    // Send pageview with path
    ReactGA.send({ hitType: "pageview", page: (window.location.pathname + window.location.search) });
  }, []);

  useDataFromGoogleSheet(
    process.env.REACT_APP_GOOGLE_API_KEY || "",
    process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    [],
  );

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/">
              <Redirect to="/info" />
            </Route>
            <Route path="/info">
              <Info />
            </Route>

            {/* Physio */}
            <Route exact path="/patients">
              <Patients />
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
            <Route path="/patientsummary/:id">
              <PatientSummary />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            {/* Physio Related Tabs - STARTS */}
            <IonTabButton tab="patients" href="/patients">
              <IonIcon icon={peopleOutline} />
              <IonLabel>Patients</IonLabel>
            </IonTabButton>
            {/* Physio Related Tabs - ENDS */}

            {/* Remove common tabs from "Summary" view/page */}
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
