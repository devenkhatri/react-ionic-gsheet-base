import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonNote, IonPage, IonRadio, IonRadioGroup, IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { save, saveOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';

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
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonItem>
          <IonLabel position="stacked">Patient Name</IonLabel>
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
        </IonItem>
        <IonItem>          
        <IonLabel position='stacked'>Session Date</IonLabel>
          <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
          <IonModal keepContentsMounted={true}>
            <IonDatetime id="datetime" showDefaultTitle={true} showDefaultButtons={true}>
              <span slot="title">Session Date</span>
            </IonDatetime>
          </IonModal>
        </IonItem>
        <IonItem lines='none' />
        <IonItem>          
        <IonLabel position='stacked' slot='start'>Payment Mode</IonLabel>
          <IonSegment value="Cash">
            <IonSegmentButton value="Cash">
              <IonLabel>Cash</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="Online">
              <IonLabel>Online</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Amount Received</IonLabel>
          <IonInput type='number' clearInput={true} defaultValue="0"></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Amount Pending</IonLabel>
          <IonInput type='number' clearInput={true} defaultValue="0"></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Amount Deposit</IonLabel>
          <IonInput type='number' clearInput={true} defaultValue="0"></IonInput>
        </IonItem>
        <IonItem lines='none' />
        <IonItem lines='none'>
          <IonButton size='large' color={"primary"} fill="clear" href='/sessions'>Cancel</IonButton>
          <IonButton size='large' color={"primary"} fill="solid" href='/sessions'>
            Save
            <IonIcon slot="start" icon={saveOutline}></IonIcon>
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default ManageSessions;
