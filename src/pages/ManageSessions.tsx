import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonNote, IonPage, IonRadio, IonRadioGroup, IonRefresher, IonRefresherContent, IonRow, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToolbar, RefresherEventDetail, useIonToast } from '@ionic/react';
import { globe, saveOutline, thumbsDown, thumbsUp } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

type PageParams = {
  id?: string;
};

const ManageSessions: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Sessions";

  const [present] = useIonToast();

  const presentToast = (color: any, icon: any,message: any) => {
    present({
      message: message,
      duration: 1500,
      position: 'top',
      icon: icon,
      color: color
    });
  };

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }

  const saveRecord = () => {
    const requestOptions: any = {
      url: `${process.env.REACT_APP_API_BASE}/.netlify/functions/addsession`,
      method: 'post',
      params: {
        itemID: id
      },
      data: {
        patientId: 'Fred',
        sessionDate: 'Flintstone',
        amountPaid: 0,
        amountPending: 0,
        paymentMode: 'Cash',
        depositAmount: 0,
        patientName: ''
      },
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };

    axios(requestOptions)
      .then(function (response) {
        console.log(response);
        presentToast('success',thumbsUp, 'Saved Successfully.....')
      })
      .catch(function (error) {
        console.log(error);
        presentToast('danger',thumbsDown, 'Sorry some error occured. Please try again to save.....')
      });
  }

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/sessions"></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" color='primary' onClick={saveRecord}>
              Save
              <IonIcon slot="start" icon={saveOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>Patient Name</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect interface="action-sheet">
                <IonSelectOption value="apples1">Apples1</IonSelectOption>
                <IonSelectOption value="oranges1">Oranges1</IonSelectOption>
                <IonSelectOption value="bananas1">Bananas1</IonSelectOption>
                <IonSelectOption value="apples2">Apples2</IonSelectOption>
                <IonSelectOption value="oranges2">Oranges2</IonSelectOption>
                <IonSelectOption value="bananas2">Bananas2</IonSelectOption>
                <IonSelectOption value="apples3">Apples3</IonSelectOption>
                <IonSelectOption value="oranges3">Oranges3</IonSelectOption>
                <IonSelectOption value="bananas3">Bananas3</IonSelectOption>
                <IonSelectOption value="apples4">Apples4</IonSelectOption>
                <IonSelectOption value="oranges4">Oranges4</IonSelectOption>
                <IonSelectOption value="bananas4">Bananas4</IonSelectOption>
                <IonSelectOption value="apples5">Apples5</IonSelectOption>
                <IonSelectOption value="oranges5">Oranges5</IonSelectOption>
                <IonSelectOption value="bananas5">Bananas5</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Session Date</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetime" showDefaultTitle={true} showDefaultButtons={true}>
                  <span slot="title">Session Date</span>
                </IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol><IonLabel>Payment Mode</IonLabel></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect interface="action-sheet" placeholder="Select Payment Mode" value={"Cash"}>
                <IonSelectOption value="Cash">Cash</IonSelectOption>
                <IonSelectOption value="Online">Online</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Amount Received</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' clearInput={true} defaultValue="0" placeholder='0'></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Amount Pending</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' clearInput={true} defaultValue="0" placeholder='0'></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Amount Deposited</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' clearInput={true} defaultValue="0" placeholder='0'></IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ManageSessions;
