import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonRefresher, IonRefresherContent, IonRow, IonGrid, IonCol, IonButton, IonIcon, IonNote } from '@ionic/react';
import { QRCode } from 'react-qrcode-logo';
import Avatar from 'react-avatar';
import { refreshPage } from '../utils';
import { shareOutline } from 'ionicons/icons';
import { RWebShare } from "react-web-share";
import moment from 'moment';

const Info: React.FC = () => {
  const title = "Info"

  const appDetails = {
    title: process.env.REACT_APP_TITLE,
    subtitle: process.env.REACT_APP_SUBTITLE,
    url: process.env.REACT_APP_URL,
  }
  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <RWebShare
              data={{
                text: appDetails.title +" - "+ appDetails.subtitle,
                url: appDetails.url,
                title: appDetails.title,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <IonButton>
                <IonIcon slot="icon-only" icon={shareOutline} color="primary"></IonIcon>
              </IonButton>
            </RWebShare>

          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonCard style={{ textAlign: "center", paddingTop: "1rem" }}>
          <Avatar src={`/assets/icon/banner${process.env.REACT_APP_CATEGORY || ''}.png`} size='80%' />
          <IonCardHeader>
            <IonCardTitle>{appDetails.title}</IonCardTitle>
            <IonCardSubtitle>{appDetails.subtitle}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow><IonCol>
                <IonLabel>Scan the QR Code to share the application</IonLabel>
              </IonCol></IonRow>
              <IonRow><IonCol>
                <QRCode
                  value={appDetails.url}
                  logoImage={`/assets/icon/icon${process.env.REACT_APP_CATEGORY || ''}.png`}
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
            <IonItem>
              <IonNote><p>Last Build Time: {moment().format("DD-MMM-YYYY HH:MM")}</p></IonNote>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Info;
