import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonNavLink, IonRefresher, IonRefresherContent, IonToast, IonSearchbar, IonProgressBar } from '@ionic/react';
import { add } from 'ionicons/icons';
import * as _ from "lodash";
import { refreshPage, useDataFromGoogleSheet } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import React, { useState } from 'react';
import moment from 'moment';
import InquiryList from '../components/InquiryList';
import ManageInquires from './ManageInquires';

const Inquires: React.FC = () => {
  const title = "Inquires"

  const { status, data, error, isFetching } = useDataFromGoogleSheet(
    process.env.REACT_APP_GOOGLE_API_KEY || "",
    process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    [],
  );
  const loading = (status === "loading");

  const inquriesData = _.filter(data, { id: "Inquires" });

  let [query, setQuery] = useState("");

  const handleChange = (ev: Event) => {
    let q = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) q = target.value!.toLowerCase();
    setQuery(q)
  }

  const sortedInquriesMembers = inquriesData && inquriesData.length > 0 && _.orderBy(inquriesData[0].data, (item: any) => moment(item["Date"], "DD-MMM-YYYY"), 'desc')
  let filteredInquriesMembers = sortedInquriesMembers && query ? _.filter(sortedInquriesMembers, (item: any) => item["Name"] && item["Name"].toLowerCase().indexOf(query) > -1) : sortedInquriesMembers;

  //if the application is physio then only show physio inquiries
  //if the application is gym then only show gym inquires
  const category = process.env.REACT_APP_CATEGORY || "";
  const isPhysioApp = (category === "physio")
  const isGymApp = (category === "gym") || (category === "gymadmin")
  if(isPhysioApp) filteredInquriesMembers = filteredInquriesMembers && _.filter(filteredInquriesMembers, (item: any) => item["Category"] == "Physio");
  if(isGymApp) filteredInquriesMembers = filteredInquriesMembers && _.filter(filteredInquriesMembers, (item: any) => item["Category"] != "Physio");

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
            <IonNavLink component={() => <ManageInquires />} routerDirection={"forward"}>
              <IonButton href='/manageinquires'>
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
          {filteredInquriesMembers && <InquiryList allInquires={filteredInquriesMembers} />}
          {!loading && filteredInquriesMembers && filteredInquriesMembers.length <= 0 && <IonItem>No Data Found...</IonItem>}
        </>
      </IonContent>
    </IonPage>
  );
};

export default Inquires;
