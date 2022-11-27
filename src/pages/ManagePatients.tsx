import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonNote, IonPage, IonRadio, IonRadioGroup, IonRefresher, IonRefresherContent, IonRow, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';

type PageParams = {
  id?: string;
};

const ManagePatients: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Patients";

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
            <IonBackButton defaultHref="/patients"></IonBackButton>
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
              <IonInput clearInput={true}></IonInput>
            </IonCol>
          </IonRow>
          <IonItemDivider />
          <IonRow>
            <IonCol>
              <IonLabel>Start Date</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetime" showDefaultTitle={true} showDefaultButtons={true}>
                  <span slot="title">Start Date</span>
                </IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>
          <IonItemDivider />
          <IonRow>
            <IonCol>
              <IonLabel>Description</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
            <IonTextarea autoCorrect='true' autoGrow={true} color={'primary'} placeholder="Enter Patient Description here..."></IonTextarea>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Phone</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' clearInput={true}></IonInput>
            </IonCol>
          </IonRow>
          <IonItemDivider/>
          <IonRow>
            <IonCol><IonLabel>Referral Type</IonLabel></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect interface="action-sheet" placeholder="Select Referral Type" value={"Direct"}>
                <IonSelectOption value="Direct">Direct</IonSelectOption>
                <IonSelectOption value="Word of Mouth">Word of Mouth</IonSelectOption>
                <IonSelectOption value="Doctor">Doctor</IonSelectOption>
                <IonSelectOption value="Pamphlets">Pamphlets</IonSelectOption>
                <IonSelectOption value="Advertisement">Advertisement</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol>
              <IonLabel>Referral Details</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea autoCorrect='true' autoGrow={true} color={'primary'} placeholder="Enter Referral Details here..."></IonTextarea>
            </IonCol>
          </IonRow>
          
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ManagePatients;
