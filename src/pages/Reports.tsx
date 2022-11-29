import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';

import axios from 'axios';
import { useEffect } from 'react';

const Reports: React.FC = () => {
  const title = "Reports"

  const requestOptions: any = {
    url: `${process.env.REACT_APP_API_BASE}/.netlify/functions/addsession`,
    method: 'post',
    params: {
      itemID: 12345
    },
    data: {
      patientId: 'Fred',
      sessionDate: 'Flintstone',
      amountPaid: 0,
      amountPending: 0,
      paymentMode: 'Cash',
      depositAmount: 0,
      patientName: '',
      collectionAmount: 0, //amountPaid + depositAmount
    },
    // responseType: 'json',
    // xsrfHeaderName: 'X-XSRF-TOKEN', 
    withCredentials: false,
    // mode: 'no-cors',
    headers: {
      // 'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  useEffect(() => {
    axios(requestOptions)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  },[]);

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
