import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonImg, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonNote } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { QRCode } from 'react-qrcode-logo';
import Avatar from 'react-avatar';

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
        <IonCard style={{ textAlign: "center", paddingTop: "1rem" }}>
          <Avatar src="/assets/icon/banner.png" size='90%' />
          <IonCardHeader>
            <IonCardTitle>Aastha Health Plus</IonCardTitle>
            <IonCardSubtitle>Physiotherapy</IonCardSubtitle>            
          </IonCardHeader>
          <IonCardContent>            
            <IonLabel>Scan the QR Code to share the application</IonLabel>
            <QRCode
              value="https://aastha-health-plus-physio-tracker.netlify.app/"
              logoImage="/assets/icon/icon.png"
              fgColor='#462e5c'
              removeQrCodeBehindLogo={true}
              qrStyle="dots"
            />
            <IonItem />
            <IonItem>
              <IonLabel color={"medium"}>Author</IonLabel>
              <IonLabel slot='end'>Deven Goratela</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
        {/* <IonImg src="/assets/icon/icon.png" /> */}
      </IonContent>
    </IonPage>
  );
};

export default Info;
