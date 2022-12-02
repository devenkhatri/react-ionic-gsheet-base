import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonRefresher, IonRefresherContent, IonItem, IonLabel, IonToast, IonProgressBar, IonGrid, IonAvatar, IonCol, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonRow } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { refreshPage } from '../utils';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import moment from 'moment';


const PhysioReports: React.FC = () => {
  const title = "Physio Reports"

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const sessionsData = _.filter(data, { id: "Sessions" });

  const sortedSessions = sessionsData && sessionsData.length > 0 && _.orderBy(sessionsData[0].data, (item: any) => item["Report: Session Date"], ['desc'])
  const groupedSessions = sortedSessions && _.groupBy(sortedSessions, (item: any) => moment(item["Session Date"], "DD-MMM-YYYY, ddd").format("DD-MMM-YYYY"))

  let grandTotalCash = 0;
  let grandTotalOnline = 0;

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
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
        <IonLabel style={{textAlign: 'center'}}><h1>Day Collection Report</h1></IonLabel>
        <IonGrid>
          <IonRow style={{backgroundColor: 'lightgrey'}}>
            <IonCol size="5"><strong >Date</strong></IonCol>
            <IonCol><strong>Cash</strong></IonCol>
            <IonCol><strong>Online</strong></IonCol>
            <IonCol><strong>Total</strong></IonCol>
          </IonRow>
          {groupedSessions && _.map(groupedSessions, (sessionDetails: any, sessionDate: any) => {
            const groupedByMode = _.groupBy(sessionDetails, (item: any) => item["Payment Mode"]);
            const totalCash = groupedByMode["Cash"] ? _.sumBy(groupedByMode["Cash"], (session: any) => _.toNumber(session["Report: Collection Amount"])) : 0;
            const totalOnline = groupedByMode["Online"] ? _.sumBy(groupedByMode["Online"], (session: any) => _.toNumber(session["Report: Collection Amount"])) : 0;
            const netTotal = totalCash + totalOnline
            grandTotalCash += totalCash
            grandTotalOnline += totalOnline
            return (
              <IonRow key={sessionDate}>
                <IonCol size="5"><strong>{sessionDate}</strong></IonCol>
                <IonCol>{totalCash}</IonCol>
                <IonCol>{totalOnline}</IonCol>
                <IonCol><strong>{netTotal}</strong></IonCol>
              </IonRow>
            )
          })}
          <IonRow style={{backgroundColor: 'lightgrey'}}>
            <IonCol size="5"><strong>Total</strong></IonCol>
            <IonCol><strong>{grandTotalCash}</strong></IonCol>
            <IonCol><strong>{grandTotalOnline}</strong></IonCol>
            <IonCol><strong>{grandTotalCash + grandTotalOnline}</strong></IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PhysioReports;
