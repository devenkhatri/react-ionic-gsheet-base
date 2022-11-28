import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonNavLink, IonRefresher, IonRefresherContent, IonToast, IonAvatar, IonItemDivider, IonItemGroup, IonItemOption, IonItemOptions, IonItemSliding, IonSearchbar } from '@ionic/react';
import ManagePatients from './ManagePatients';
import { add, pencil } from 'ionicons/icons';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import Avatar from 'react-avatar';
import { useState } from 'react';


const Patients: React.FC = () => {
  const title = "Patients"

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const patientsData = _.filter(data, { id: "Patients" });

  let [query, setQuery] = useState("");

  const handleChange = (ev: Event) => {
    let q = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) q = target.value!.toLowerCase();
    setQuery(q)
  }

  const sortedPatients = patientsData && patientsData.length > 0 && _.orderBy(patientsData[0].data, (item: any) => item["Name"])
  const filteredPatients = sortedPatients && query?_.filter(sortedPatients, (item: any) => item["Name"] && item["Name"].toLowerCase().indexOf(query) > -1):sortedPatients;
  const groupedPatients = filteredPatients && _.groupBy(filteredPatients, (item: any) => item["Name"] && item["Name"].charAt(0).toUpperCase())

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonNavLink component={() => <ManagePatients />} routerDirection={"forward"}>
              <IonButton href='/managepatient'>
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
          {groupedPatients && _.map(groupedPatients, (patientDetails: any, initials: any) => (
            <IonItemGroup key={initials}>
              <IonItemDivider color="primary">
                <IonLabel>
                  {initials}
                </IonLabel>
              </IonItemDivider>
              {patientDetails.map((patient: any) => (
                <IonItemSliding key={patient["🔒 Row ID"]}>
                  <IonItem button={true} key={patient["🔒 Row ID"]} detail={true} href={`/viewpatient/${patient["🔒 Row ID"]}`}>
                    <IonAvatar slot="start">
                      <Avatar name={patient["Name"]} round size="100%" />
                    </IonAvatar>
                    <IonLabel>{patient["Name"]}</IonLabel>
                    {/* <IonLabel slot='end'>{patient["Description"]}</IonLabel> */}
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

export default Patients;
