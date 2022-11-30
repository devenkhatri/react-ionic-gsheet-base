import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { saveOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { refreshPage } from '../utils';

type PageParams = {
  id?: string;
};

const ManagePatients: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Patients";

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
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
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
