import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonMenuButton, IonNavLink, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import ManageSessions from './ManageSessions';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import SessionList from '../components/SessionList';
import moment from 'moment';

const Sessions: React.FC = () => {

  const title = "Sessions"
 
  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const sessionsData = _.filter(data, { id: "Sessions" });
  // const patientsData = _.filter(data, { id: "Patients" });

  const sortedSessions = sessionsData && sessionsData.length > 0 && _.orderBy(sessionsData[0].data, (item: any) => moment(item["Report: Session Date"], 'DD-MMM-YYYY'), ['desc'])
  const groupedSessions = sortedSessions && _.groupBy(sortedSessions, (item: any) => item["Report: Session Date"])

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar> }
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonNavLink component={() => <ManageSessions />} routerDirection={"forward"}>
              <IonButton href='/managesession'>
                <IonIcon slot="icon-only" icon={add} color="primary"></IonIcon>
              </IonButton>
            </IonNavLink>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {loading &&
          <ListLoadingSkeleton />
        }
        <IonToast
          isOpen={!!error}
          position={'top'}
          color={'danger'}
          message="Error occurred while fetching the details. Please try again !!!"
          duration={1500}
        />
        {error &&
          <IonItem color={'light'}>
            <IonLabel color={'danger'}>Error loading data. Please refresh the page to try again !!!</IonLabel>
          </IonItem>
        }
        <>
          {groupedSessions && _.map(groupedSessions, (sessionDetails: any, sessionDate: any) => (
            <IonItemGroup key={sessionDate}>
              <IonItemDivider color="primary" style={{padding: '0.5rem 1rem', margin:'1rem 0'}}>
                <IonLabel>
                  {sessionDate}
                </IonLabel>
              </IonItemDivider>
              <SessionList allSessions={sessionDetails} />
            </IonItemGroup>
          ))}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Sessions;
