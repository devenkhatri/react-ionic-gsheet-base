import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, useIonToast } from '@ionic/react';
import { saveOutline, thumbsDown, thumbsUp } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { refreshPage, useDataFromGoogleSheet } from '../utils';
import * as _ from "lodash";
import { useEffect, useState } from 'react';
import moment from 'moment';

type PageParams = {
  id?: string;
};

const ManageWellnessSessions: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Sessions";

  const { data, error, isFetching } = useDataFromGoogleSheet(
    process.env.REACT_APP_GOOGLE_API_KEY || "",
    process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    [],
  );
  
  const patientsData = _.filter(data, { id: "WellnessPatients" });
  const sortedPatients = patientsData && patientsData.length > 0 && _.orderBy(patientsData[0].data, (item: any) => item["Name"])
  const [allPatients, setAllPatients] = useState<any>()

  const sessionsData = _.filter(data, { id: "WellnessSessions" });
  const filteredSession = sessionsData && sessionsData.length > 0 && _.filter(sessionsData[0].data, { "🔒 Row ID": id })
  const currentSession: any = (filteredSession && filteredSession.length > 0) ? filteredSession[0] : {}

  const [present] = useIonToast();
  const [showLoading, setShowLoading] = useState(false);

  const [patientID, setPatientID] = useState("")
  const [patientName, setPatientName] = useState<any>("")
  const [profilePhoto, setProfilePhoto] = useState("")
  const [sessionDescription, setSessionDescription] = useState("")
  const [sessionDate, setSessionDate] = useState<any>(moment().format())
  const [sittingsUsed, setSittingsUsed] = useState<any>(1)

  useEffect(() => {
    if (!allPatients) setAllPatients(sortedPatients);    
    if (isEdit && currentSession) {
      setPatientID(currentSession["Patient ID"])
      currentSession["Session Date"] && setSessionDate(moment(currentSession["Session Date"], "DD-MMM-YYYY, ddd").format())
      setSittingsUsed(currentSession["Sittings Used"])
      setSessionDescription(currentSession["Session Description"])
    }
  }, [currentSession, allPatients]);

  const presentToast = (color: any, icon: any, message: any) => {
    present({
      message: message,
      duration: 1500,
      position: 'top',
      icon: icon,
      color: color
    });
  };

  const saveRecord = () => {
    if (!patientID || !patientName) {
      presentToast('danger', thumbsDown, 'Please select Patient Name...')
      return;
    }
    const requestOptions: any = {
      baseURL: process.env.REACT_APP_API_BASE || '',
      url: `.netlify/functions/wellnesssessionmgmt`,
      method: 'post',
      params: {
        itemID: id
      },
      data: {
        patientId: patientID,
        sessionDate: sessionDate,
        sessionDescription: sessionDescription,
        sittingsUsed: sittingsUsed,
        patientName: patientName,
        profilePhoto: profilePhoto,
      },
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };

    setShowLoading(true);
    axios(requestOptions)
      .then(function (response: any) {
        console.log(response);
        presentToast('success', thumbsUp, response?.data?.message || 'Saved Successfully.....');
        setShowLoading(false)
        window.location.href = id ? `/viewwellnesssession/${id}` : "/wellnesssessions";
      })
      .catch(function (error) {
        console.log(error);
        setShowLoading(false)
        presentToast('danger', thumbsDown, 'Sorry some error occured. Please try again to save.....')
      });
  }

  const getPatientNameFromID = (pId: string) => {
    if (!sortedPatients) return null;
    const filteredPatient = _.filter(sortedPatients, { "🔒 Row ID": pId })
    const currentPatient: any = (filteredPatient && filteredPatient.length > 0) ? filteredPatient[0] : {}
    const reportPatientName = (currentPatient["Name"] + " - " + currentPatient["Treatment Type"]) || ""
    return reportPatientName;
  }

  const getPatientPhotoFromID = (pId: string) => {
    if (!sortedPatients) return null;
    const filteredPatient = _.filter(sortedPatients, { "🔒 Row ID": pId })
    const currentPatient: any = (filteredPatient && filteredPatient.length > 0) ? filteredPatient[0] : {}
    return currentPatient["Profile Photo"];
  }

  const handleSearch = (ev: Event) => {
    if (!sortedPatients) return null;
    let q = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) q = target.value!.toLowerCase();
    const filteredPatients = _.filter(sortedPatients, (item: any) => item["Name"] && item["Name"].toLowerCase().indexOf(q) >= 0)
    setAllPatients(filteredPatients)
    const currentPatient: any = (filteredPatients && filteredPatients.length > 0) ? filteredPatients[0] : {}
    setPatientID(q ? currentPatient["🔒 Row ID"] : "")
  }

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {isFetching && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot="start">
            <IonBackButton defaultHref={id ? `/viewwellnesssession/${id}` : "/wellnesssessions"}></IonBackButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton fill="clear" color='primary' onClick={saveRecord} disabled={isFetching}>
              Save
              <IonIcon slot="start" icon={saveOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} scrollY={true}>
        <>
          <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>          
          <IonToast
            isOpen={!!error}
            position={'top'}
            color={'danger'}
            message="Error occurred while fetching the details. Please try again !!!"
            duration={1500}
          />
          {error &&
            <IonItem color={'light'}>
              <IonLabel color={'danger'}>Error loading data. Please refresh the page to try again !!!</IonLabel>
            </IonItem>
          }
          <IonLoading
            isOpen={showLoading}
            onDidDismiss={() => setShowLoading(false)}
            message={'Please wait while the data is being saved...'}
          />
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonLabel>Patient Name</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonSearchbar animated={true} showClearButton="focus" placeholder="Search Patient" onIonChange={(ev) => handleSearch(ev)}></IonSearchbar>
                <IonSelect
                  interface="action-sheet"
                  interfaceOptions={{ header: "Select Patient" }}
                  onIonChange={(e) => {
                    setPatientID(e.detail.value);
                    setPatientName(getPatientNameFromID(e.detail.value))
                    setProfilePhoto(getPatientPhotoFromID(e.detail.value))
                  }}
                  value={patientID}
                  style={{ background: "var(--ion-color-light)" }}
                >
                  {allPatients && allPatients.map((patient: any) => (
                    <IonSelectOption key={patient["🔒 Row ID"]} value={patient["🔒 Row ID"]}>{patient["Name"]} - {patient["Treatment Type"]}</IonSelectOption>
                  ))}
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
                <IonDatetimeButton datetime="datetime" style={{ background: "var(--ion-color-light)" }}></IonDatetimeButton>
                <IonModal keepContentsMounted={true}>
                  <IonDatetime
                    id="datetime"
                    showDefaultTitle={true}
                    showDefaultButtons={true}
                    onIonChange={(e) => setSessionDate(e.detail.value)}
                    value={sessionDate}
                  >
                    <span slot="title">Session Date</span>
                  </IonDatetime>
                </IonModal>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonLabel>Session Description</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonTextarea
                  autoCorrect='true'
                  autoGrow={true}
                  placeholder="Enter Treatment Description here..."
                  onIonInput={(e: any) => setSessionDescription(e.target.value)}
                  value={sessionDescription}
                  style={{ background: "var(--ion-color-light)" }} />
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonLabel>Sittings Used in current Session</IonLabel>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput type='number' defaultValue="0" placeholder='0'
                  onIonInput={(e) => setSittingsUsed(e.target.value)}
                  style={{ background: "var(--ion-color-light)" }}
                  value={sittingsUsed}></IonInput>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      </IonContent>
    </IonPage>
  );
};

export default ManageWellnessSessions;
