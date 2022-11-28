import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonLoading, IonMenuButton, IonNavLink, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToast, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { add, pencil } from 'ionicons/icons';
import ManageSessions from './ManageSessions';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { useEffect, useState } from 'react';
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';

const Sessions: React.FC = () => {

  const title = "Sessions"

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const sessionsData = _.filter(data, { id: "Sessions" });
  const patientsData = _.filter(data, { id: "Patients" });

  const sortedSessions = sessionsData && sessionsData.length > 0 && _.orderBy(sessionsData[0].data, (item: any) => item["Report: Session Date"], ['desc'])
  const groupedSessions = sortedSessions && _.groupBy(sortedSessions, (item: any) => item["Report: Session Date"])

  console.log("****** data", groupedSessions)
  
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
        <>
          {groupedSessions && _.map(groupedSessions, (sessionDetails: any, sessionDate: any) => (
            <IonItemGroup key={sessionDate}>
              <IonItemDivider color="light">
                <IonLabel>
                  {sessionDate}
                </IonLabel>
              </IonItemDivider>
              {sessionDetails.map((session: any) => (
                <IonItemSliding>
                  <IonItem button={true} key={session["🔒 Row ID"]} detail={true}>
                    <IonLabel>{session["Report: Patient Name"]}</IonLabel>
                    <IonLabel slot='end'>{session["Report: Collection Amount"]}</IonLabel>
                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption>
                      <IonIcon icon={pencil} />&nbsp;
                      Edit
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonItemGroup>
          ))}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Sessions;
