import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonRefresher, IonRefresherContent, IonItem, IonLabel, IonToast, IonProgressBar, IonCard, IonCardTitle, IonList, IonRouterLink, IonCardSubtitle } from '@ionic/react';
import { refreshPage } from '../utils';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import GymReportExpiringList from '../components/GymReportExpiringList';
import moment from 'moment';
import GymMemberList from '../components/GymMemberList';


const GymReports: React.FC = () => {
  const title = "Gym Reports"

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const gymMembersData = _.filter(data, { id: "GymMembers" });

  const sortedGymMembers = gymMembersData && gymMembersData.length > 0 && _.orderBy(gymMembersData[0].data, (item: any) => moment(item["Ending Date"], "DD-MMM-YYYY"))
  const activeMemberships = sortedGymMembers && _.filter(sortedGymMembers, (item: any) => (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) > 0)
  const expiredMemberships = sortedGymMembers && _.filter(sortedGymMembers, (item: any) => (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) <= 0)

  function scroll(id: any) {
    var anchor = document.getElementById(id);
    anchor && anchor.scrollIntoView({block: "start", behavior: "smooth"});
  }

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
        <IonLabel color={'primary'} class="reportTitle"><h1>Overall Membership Statistics</h1></IonLabel>
        <IonList>          
          <IonCard onClick={()=>scroll("activememberlist")} style={{ cursor: "pointer", textAlign: "center", padding: '1rem', background: 'rgba(var(--ion-color-success-rgb), 0.15)' }}>
            <IonCardSubtitle color={'primary'}>Total Active Memberships</IonCardSubtitle>
            <IonLabel color={'primary'}><h1>{activeMemberships ? activeMemberships.length : 0}</h1></IonLabel>
          </IonCard>
          
          <IonCard style={{ textAlign: "center", padding: '1rem', background: 'rgba(var(--ion-color-danger-rgb), 0.15)' }}>
            <IonCardSubtitle color={'danger'}>Total Memberships Expired</IonCardSubtitle>
            <IonLabel color={'danger'}><h1>{expiredMemberships ? expiredMemberships.length : 0}</h1></IonLabel>
          </IonCard>
        </IonList>
        
        <GymReportExpiringList data={gymMembersData} />
        <IonItem />

        <a id="activememberlist"></a>
        <IonLabel color={'primary'} class="reportTitle"><h1>All Active Member List</h1></IonLabel>
        <GymMemberList allGymMembers={activeMemberships} />

      </IonContent>
    </IonPage>
  );
};

export default GymReports;
