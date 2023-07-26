import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonRefresher, IonRefresherContent, IonRow, IonGrid, IonCol, IonButton, IonIcon, IonNote, IonImg, IonAvatar } from '@ionic/react';
import { QRCode } from 'react-qrcode-logo';
import Avatar from 'react-avatar';
import { refreshPage } from '../utils';
import { shareOutline } from 'ionicons/icons';
import { RWebShare } from "react-web-share";
import moment from 'moment';
import preval from 'preval.macro';

const buildTimestamp = preval`module.exports = new Date().getTime();`;

const GotoReviews: React.FC = () => {
  const title = "Google Reviews"

  const appDetails = {
    title: process.env.REACT_APP_TITLE,
    subtitle: `Ye " Aastha Health Plus " ke google account par reviews dalvane k liye Link he, isko customer and relative ko share kare and jitna ho sake utne jyada reviews dalvaao`,
    url: `https://bit.ly/3XSjIjV`,
  }

  const getBuildTimeString = () => {
      const lastUpdateMoment = moment.unix(buildTimestamp / 1000);
      const formattedDate    = lastUpdateMoment.format('DD-MMM-YYYY HH:mm:ss');
      return formattedDate;
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
          <IonCardHeader>
            <IonCardTitle>{appDetails.title}</IonCardTitle>
            {/* <IonCardSubtitle>{appDetails.subtitle}</IonCardSubtitle> */}
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow><IonCol>
                <IonLabel>Ye "Aastha Health Plus" ke google account par reviews dalvane k liye QR code he, isko scan karte hi sidha reviews profile par chala jaayega customer</IonLabel>
              </IonCol></IonRow>
              <IonRow><IonCol>
        <img alt="Silhouette of a person's head" src="/assets/icon/googlereview-qr.jpeg" width={'100%'} />
              
              </IonCol></IonRow>
            </IonGrid>
            <IonItem />            
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default GotoReviews;
