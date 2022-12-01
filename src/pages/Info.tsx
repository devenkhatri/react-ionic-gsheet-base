import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonRefresher, IonRefresherContent, IonRow, IonGrid, IonCol, IonButton, IonIcon } from '@ionic/react';
import { QRCode } from 'react-qrcode-logo';
import Avatar from 'react-avatar';
import { refreshPage } from '../utils';
import { shareOutline } from 'ionicons/icons';
import { RWebShare } from "react-web-share";

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
          <IonButtons slot="end">
            <IonButton>
              <RWebShare
                data={{
                  text: "Physiotherapy App",
                  url: "https://aastha-health-plus-physio-tracker.netlify.app/",
                  title: "Aastha Health Plus",
                }}
                onClick={() => console.log("shared successfully!")}
              >
                <IonIcon slot="icon-only" icon={shareOutline} color="primary"></IonIcon>
              </RWebShare>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonCard style={{ textAlign: "center", paddingTop: "1rem" }}>
          <Avatar src="/assets/icon/banner.png" size='90%' />
          <IonCardHeader>
            <IonCardTitle>Aastha Health Plus</IonCardTitle>
            <IonCardSubtitle>Physiotherapy App</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow><IonCol>
                <IonLabel>Scan the QR Code to share the application</IonLabel>
              </IonCol></IonRow>
              <IonRow><IonCol>
                <QRCode
                  value="https://aastha-health-plus-physio-tracker.netlify.app/"
                  logoImage="/assets/icon/icon.png"
                  fgColor='#462e5c'
                  removeQrCodeBehindLogo={true}
                  qrStyle="dots"
                />
              </IonCol></IonRow>
            </IonGrid>
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
