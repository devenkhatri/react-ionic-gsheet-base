import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonRefresher, IonRefresherContent } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { refreshPage } from '../utils';

const Reports: React.FC = () => {
  const title = "Reports"

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          {/* <IonButtons slot="end">
              <IonButton>
                <IonIcon slot="icon-only" icon={add} color="primary"></IonIcon>
              </IonButton>
            </IonButtons> */}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <ExploreContainer name={`${title} is coming soon.......`} />
      </IonContent>
    </IonPage>
  );
};

export default Reports;
