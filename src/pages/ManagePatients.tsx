import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const ManagePatients: React.FC = () => {
  const title = "Manage Patients"
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
        </IonContent>
      </IonPage>    
  );
};

export default ManagePatients;
