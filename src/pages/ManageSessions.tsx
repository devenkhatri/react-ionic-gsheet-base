import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar, useIonToast } from '@ionic/react';
import { saveOutline, thumbsDown, thumbsUp } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { refreshPage } from '../utils';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import { useEffect, useState } from 'react';
import moment from 'moment';

type PageParams = {
  id?: string;
};

const ManageSessions: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Sessions";

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const patientsData = _.filter(data, { id: "Patients" });
  const sortedPatients = patientsData && patientsData.length > 0 && _.orderBy(patientsData[0].data, (item: any) => item["Name"])

  const optionsData = _.filter(data, { id: "Options" });
  const allPaymentModes = optionsData && optionsData.length > 0 && _.filter(optionsData[0].data, (item: any) => item["Payment Modes"])
  const defaultPaymentMode: any = allPaymentModes && allPaymentModes.length > 0 && _.head(allPaymentModes);

  const sessionsData = _.filter(data, { id: "Sessions" });
  const filteredSession = sessionsData && sessionsData.length > 0 && _.filter(sessionsData[0].data, { "🔒 Row ID": id })
  const currentSession: any = (filteredSession && filteredSession.length > 0) ? filteredSession[0] : {}

  const [present] = useIonToast();
  const [showLoading, setShowLoading] = useState(false);

  const [patientID, setPatientID] = useState("")
  const [patientName, setPatientName] = useState("")
  const [sessionDate, setSessionDate] = useState<any>(moment().format())
  const [paymentMode, setPaymentMode] = useState("")
  const [amountPaid, setAmountPaid] = useState<any>()
  const [amountPending, setAmountPending] = useState<any>()
  const [depositAmount, setDepositAmount] = useState<any>()

  useEffect(() => {
    if(!paymentMode) setPaymentMode(defaultPaymentMode && defaultPaymentMode["Payment Modes"]);
    if (isEdit && currentSession) {
      setPatientID(currentSession["Patient ID"])
      currentSession["Session Date"] && setSessionDate(moment(currentSession["Session Date"], "DD-MMM-YYYY, ddd").format())
      setPaymentMode(currentSession["Payment Mode"])
      setAmountPaid(currentSession["Amount Paid"])
      setAmountPending(currentSession["Amount Pending"])
      setDepositAmount(currentSession["Deposit Amount"])
    }
  }, [paymentMode, defaultPaymentMode, currentSession]);

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
    if(!patientID || !patientName) {
      presentToast('danger', thumbsDown, 'Please select Patient Name...')
      return;
    }
    const requestOptions: any = {
      baseURL: process.env.REACT_APP_API_BASE || '',
      url: `.netlify/functions/sessionmgmt`,
      method: 'post',
      params: {
        itemID: id
      },
      data: {
        patientId: patientID,
        sessionDate: sessionDate,
        amountPaid: amountPaid,
        amountPending: amountPending,
        paymentMode: paymentMode,
        depositAmount: depositAmount,
        patientName: patientName
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
        window.location.href = id ? `/viewsession/${id}` : "/sessions";
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
    return currentPatient["Name"];
  }

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar> }
          <IonButtons slot="start">
            <IonBackButton defaultHref={id ? `/viewsession/${id}` : "/sessions"}></IonBackButton>
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
        <IonRefresher slot="fixed" onIonRefresh={refreshPage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {loading &&
          <ListLoadingSkeleton />
        }
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
              <IonSelect interface="action-sheet"
                onIonChange={(e) => {
                  setPatientID(e.detail.value);
                  setPatientName(getPatientNameFromID(e.detail.value))
                }}
                value={patientID}
                style={{background: "var(--ion-color-light)"}}
              >
                {sortedPatients && sortedPatients.map((patient: any) => (
                  <IonSelectOption key={patient["🔒 Row ID"]} value={patient["🔒 Row ID"]}>{patient["Name"]}</IonSelectOption>
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
              <IonDatetimeButton datetime="datetime" style={{background: "var(--ion-color-light)"}}></IonDatetimeButton>
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
            <IonCol><IonLabel>Payment Mode</IonLabel></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect interface="action-sheet" placeholder="Select Payment Mode"
                value={paymentMode}
                onIonChange={(e) => setPaymentMode(e.detail.value)}
                style={{background: "var(--ion-color-light)"}}
              >
                {allPaymentModes && allPaymentModes.map((options: any) => (
                  <IonSelectOption key={options["Payment Modes"]} value={options["Payment Modes"]}>{options["Payment Modes"]}</IonSelectOption>
                ))}
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
              <IonInput type='number' defaultValue="0" placeholder='0'
                onIonInput={(e) => setAmountPaid(e.target.value)}
                style={{background: "var(--ion-color-light)"}}
                value={amountPaid}></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Amount Pending</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' defaultValue="0" placeholder='0'
                onIonInput={(e) => setAmountPending(e.target.value)}
                style={{background: "var(--ion-color-light)"}}
                value={amountPending}></IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Amount Deposited</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' defaultValue="0" placeholder='0'
                onIonInput={(e) => setDepositAmount(e.target.value)}
                style={{background: "var(--ion-color-light)"}}
                value={depositAmount}></IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ManageSessions;
