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
import { peopleOutline, barChartOutline, calendarOutline } from 'ionicons/icons';
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

setupIonicReact();

const App: React.FC = () => (
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
          <Route exact path="/managepatient">
            <ManagePatients />
          </Route>
          <Route path="/reports">
            <Reports />
          </Route>
          <Route exact path="/">
            <Redirect to="/sessions" />
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
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
