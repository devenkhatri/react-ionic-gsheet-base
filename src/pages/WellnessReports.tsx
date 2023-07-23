import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonRefresher, IonRefresherContent, IonItem, IonLabel, IonToast, IonProgressBar, IonCol, IonGrid, IonRow, IonBadge } from '@ionic/react';
import { refreshPage, useDataFromGoogleSheet } from '../utils';
import * as _ from "lodash";
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import moment from 'moment';


const WellnessReports: React.FC = () => {
  const title = "Wellness Reports"

  const { status, data, error, isFetching } = useDataFromGoogleSheet(
    process.env.REACT_APP_GOOGLE_API_KEY || "",
    process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    [],
  );
  const loading = (status === "loading");

  const patientsData = _.filter(data, { id: "WellnessPatients" });
  const sessionsData = _.filter(data, { id: "WellnessSessions" });

  const sortedPatients = patientsData && patientsData.length > 0 && _.orderBy(patientsData[0].data, (item: any) => item["Name"])

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {isFetching && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <>
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
        <IonLabel color={'primary'} class="reportTitle"><h1>Patients Sittings Report</h1></IonLabel>
            <IonGrid>
                <IonLabel color={'primary'}>
                    <IonRow class="header">
                        <IonCol size="3">Name</IonCol>
                        <IonCol size="3" class="numberType">Total</IonCol>
                        <IonCol size="3" class="numberType">Used</IonCol>
                        <IonCol size="3" class="numberType">Remaining</IonCol>
                    </IonRow>
                </IonLabel>
                {sortedPatients && _.map(sortedPatients, (patientDetails: any) => {
                  const filteredSession = patientDetails && sessionsData && sessionsData.length > 0 && _.filter(sessionsData[0].data, { "Patient ID": patientDetails["🔒 Row ID"] })
                  const sortedSessions = filteredSession && _.orderBy(filteredSession, (item: any) => moment(item["Report: Session Date"], 'DD-MMM-YYYY'), ['desc'])

                  const totalTreatmentSessions = patientDetails["Treatment Total Sittings"] || 0;
                  const totalSittingsUsed = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Sittings Used"]));
                  const remaining = totalTreatmentSessions - totalSittingsUsed;
                  //show yellow if 1 setting remaining
                  const remainingStyle = remaining === 1 ? 'warning' : (remaining > 0 ? 'success' : 'danger');

                    return (
                        <IonRow key={patientDetails["🔒 Row ID"]} class="itemrow">
                            <IonCol size="3">{patientDetails["Name"]} - {patientDetails["Treatment Type"]}</IonCol>
                            <IonCol size="3" class="numberType">{totalTreatmentSessions}</IonCol>
                            <IonCol size="3" class="numberType">{totalSittingsUsed}</IonCol>
                            <IonCol size="3" class="numberType"><IonBadge color={remainingStyle} style={{padding: "0.5rem"}}>{remaining}</IonBadge></IonCol>
                        </IonRow>
                    )
                })}
            </IonGrid>
        </>
      </IonContent>
    </IonPage>
  );
};

export default WellnessReports;
