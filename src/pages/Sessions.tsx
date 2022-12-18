import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonMenuButton, IonNavLink, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import ManageSessions from './ManageSessions';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import SessionList from '../components/SessionList';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const Sessions: React.FC = () => {

  const title = "Sessions"

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const [logDate,] = useState(moment())
  const [items, setItems] = useState<any>({});
  const scrollSize = 3;
  const [currentPage, setCurrentPage] = useState(1);
  console.log("******* Time Diff = ", logDate.diff(moment()))

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const generateItems = () => {
    const sessionsData = _.filter(data, { id: "Sessions" });
    const groupedSessions = sessionsData && sessionsData.length > 0 && _.groupBy(sessionsData[0].data, (item: any) => item["Report: Session Date"])
    const sortedSessionKeys = groupedSessions && _.orderBy(Object.keys(groupedSessions), key => moment(key, 'DD-MMM-YYYY'), ['desc'])
    // console.log("****** sortedSessionKeys", sortedSessionKeys)
    if (sortedSessionKeys) {
      const newItems: any = items;
      let newPageLength = Object.keys(items).length + (scrollSize * currentPage);
      // console.log("****** newPageLength", newPageLength)
      if (newPageLength > Object.keys(sortedSessionKeys).length) newPageLength = Object.keys(sortedSessionKeys).length;
      for (let i = 0; i < newPageLength; i++) {
        newItems[sortedSessionKeys[i]] = groupedSessions[sortedSessionKeys[i]]
      }
      setItems(newItems);
      forceUpdate(); //this is used to force the state update after setting items
    }
  };
  console.log("****** items", items)
  console.log("****** currentPage", currentPage)
  console.log("******** Object.keys(items).length", Object.keys(items).length)

  useEffect(() => {
    generateItems();
  }, [data, currentPage]);

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
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
        {Object.keys(items).length > 0 &&
          <React.Fragment>
            {_.map(items, (sessionDetails: any, sessionDate: any) => (
              <IonItemGroup key={sessionDate}>
                <IonItemDivider color="primary" style={{ padding: '0.5rem 1rem', margin: '1rem 0' }}>
                  <IonLabel>
                    {sessionDate}
                  </IonLabel>
                </IonItemDivider>
                <SessionList allSessions={sessionDetails} />
              </IonItemGroup>
            ))}
            <IonInfiniteScroll
              onIonInfinite={(ev) => {
                setCurrentPage(currentPage + 1);
                setTimeout(() => ev.target.complete(), 500);
              }}
            >
              <IonInfiniteScrollContent loadingText="Loading data..." loadingSpinner="bubbles"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </React.Fragment>
        }
        {!loading && Object.keys(items).length <= 0 && <IonItem><IonLabel color={'primary'}>No Data Found</IonLabel></IonItem>}
      </IonContent>
    </IonPage>
  );
};

export default Sessions;
