import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonNote, IonPage, IonRadio, IonRadioGroup, IonRefresher, IonRefresherContent, IonRow, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';

type PageParams = {
  id?: string;
};

const ManageSessions: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Sessions";

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
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
            <IonButton fill="clear" color='primary'>
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
          <IonItemDivider />
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
          <IonItemDivider />
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
          <IonItemDivider />
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
