import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonImg } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

const Info: React.FC = () => {
  const title = "Info"

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonImg src="/assets/icon/icon.png" />
        <ExploreContainer name={`${title} is coming soon.......`} />
      </IonContent>
    </IonPage>
  );
};

export default Info;
