import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonNavLink, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { add} from 'ionicons/icons';
import ManageSessions from './ManageSessions';
import useGoogleSheets from 'use-google-sheets';

const Sessions: React.FC = () => {

  const title = "Sessions"

  const { data, loading, error, refetch } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [{ id: 'Sessions' }],
  });

  console.log("****** data", data && data.length >0 && data[0].data)
  data && data.length >0 && data[0].data.map((item: any) => {
    // console.log(item["Session Date"])
  })

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonNavLink component={()=><ManageSessions/>} routerDirection={"forward"}>
            <IonButton href='/managesession'>
              <IonIcon slot="icon-only" icon={add} color="primary"></IonIcon>            
            </IonButton>
            </IonNavLink>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refetch}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {loading && <div>Loading...</div>}
        {error && <div>Error!</div>}
        <IonList>
          {data && data.length >0 && data[0].data.map((item: any) => (
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
