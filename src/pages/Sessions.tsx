import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonMenuButton, IonNavLink, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToast, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { add } from 'ionicons/icons';
import ManageSessions from './ManageSessions';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { useState } from 'react';
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';

const Sessions: React.FC = () => {

  const title = "Sessions"

  const [items, setItems] = useState<any[]>([]);

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const getItems = () => {
    const newItems = [];
    for (let i = 0; i < 50; i++) {
      newItems.push(`Item ${1 + items.length + i}`);
    }
    setItems([...items, ...newItems]);
  };

  const sessionsData = _.filter(data, { id: "Sessions" });
  const patientsData = _.filter(data, { id: "Patients" });

  console.log("****** data", data, sessionsData)

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
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
        <IonList>
          {sessionsData && sessionsData.length > 0 && sessionsData[0].data.map((item: any) => (
            <IonItem button={true} key={item["🔒 Row ID"]}>
              <IonLabel>
                <h2>{item["Report: Patient Name"]}</h2>
                <p>{item["Report: Session Date"]}</p>
                <p>{item["Report: Collection Amount"]}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Sessions;
