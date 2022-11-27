import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

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
          <ExploreContainer name={title} />
          <IonButton target='_blank' href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQzzndt387vajYtxYgRmreohxXvU7sqvtSk6OmG1o8eiPyQF9T3DYZS5U87qVEewNbEySbQUZ6k7Wuy/pubhtml?gid=569572014&single=true">Test Link</IonButton>
        </IonContent>
      </IonPage>    
  );
};

export default Reports;
