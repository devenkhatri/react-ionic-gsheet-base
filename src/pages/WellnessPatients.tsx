import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonNavLink, IonRefresher, IonRefresherContent, IonToast, IonItemDivider, IonItemGroup, IonSearchbar, IonProgressBar } from '@ionic/react';
import ManagePatients from './ManagePatients';
import { add } from 'ionicons/icons';
import * as _ from "lodash";
import { refreshPage, useDataFromGoogleSheet } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import { useState } from 'react';
import WellnessPatientList from '../components/WellnessPatientList';

const WellnessPatients: React.FC = () => {
  const title = "Wellness Patients"

  const { status, data, error, isFetching } = useDataFromGoogleSheet(
    process.env.REACT_APP_GOOGLE_API_KEY || "",
    process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    [],
  );
  const loading = (status === "loading");

  const patientsData = _.filter(data, { id: "WellnessPatients" });

  let [query, setQuery] = useState("");

  const handleChange = (ev: Event) => {
    let q = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) q = target.value!.toLowerCase();
    setQuery(q)
  }

  const sortedPatients = patientsData && patientsData.length > 0 && _.orderBy(patientsData[0].data, (item: any) => item["Name"])
  const filteredPatients = sortedPatients && query ? _.filter(sortedPatients, (item: any) => item["Name"] && item["Name"].toLowerCase().indexOf(query) > -1) : sortedPatients;
  const groupedPatients = filteredPatients && _.groupBy(filteredPatients, (item: any) => item["Name"] && item["Name"].charAt(0).toUpperCase())

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {isFetching && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonNavLink component={() => <ManagePatients />} routerDirection={"forward"}>
              <IonButton href='/managewellnesspatient'>
                <IonIcon slot="icon-only" icon={add} color="primary"></IonIcon>
              </IonButton>
            </IonNavLink>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar animated={true} showClearButton="focus" placeholder="Search" onIonChange={(ev) => handleChange(ev)}></IonSearchbar>
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
          {groupedPatients && _.map(groupedPatients, (patientDetails: any, initials: any) => (
            <IonItemGroup key={initials}>
              <IonItemDivider color="primary" style={{ padding: '0.5rem 1rem', margin: '1rem 0' }}>
                <IonLabel>
                  {initials}
                </IonLabel>
              </IonItemDivider>
              <WellnessPatientList allPatients={patientDetails} />
            </IonItemGroup>
          ))}
        </>
      </IonContent>
    </IonPage>
  );
};

export default WellnessPatients;
