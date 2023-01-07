import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonNavLink, IonRefresher, IonRefresherContent, IonToast, IonSearchbar, IonProgressBar } from '@ionic/react';
import { add } from 'ionicons/icons';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import React, {  useState } from 'react';
import moment from 'moment';
import InquiryList from '../components/InquiryList';
import ManageInquires from './ManageInquires';

const Inquires: React.FC = () => {
  const title = "Inquires"

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const inquriesData = _.filter(data, { id: "Inquires" });

  let [query, setQuery] = useState("");

  const handleChange = (ev: Event) => {
    let q = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) q = target.value!.toLowerCase();
    setQuery(q)
  }

  const sortedInquriesMembers = inquriesData && inquriesData.length > 0 && _.orderBy(inquriesData[0].data, (item: any) => moment(item["Date"], "DD-MMM-YYYY"))
  const filteredInquriesMembers = sortedInquriesMembers && query ? _.filter(sortedInquriesMembers, (item: any) => item["Name"] && item["Name"].toLowerCase().indexOf(query) > -1) : sortedInquriesMembers;

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
        {!loading && filteredInquriesMembers && filteredInquriesMembers.length <=0 && <IonItem>No Data Found...</IonItem>}        
      </IonContent>
    </IonPage>
  );
};

export default Inquires;
