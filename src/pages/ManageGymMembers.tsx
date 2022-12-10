import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToast, IonToggle, IonToolbar, useIonToast } from '@ionic/react';
import axios from 'axios';
import { saveOutline, thumbsDown, thumbsUp } from 'ionicons/icons';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGoogleSheets from 'use-google-sheets';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import { refreshPage } from '../utils';

type PageParams = {
  id?: string;
};

const ManageGymMembers: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Gym Members";

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [joiningDate, setJoiningDate] = useState<any>(moment().format())
  const [months, setMonths] = useState()
  const [isPersonalTraining, setIsPersonalTraining] = useState("")
  const [paymentMode, setPaymentMode] = useState("")
  const [amountReceived, setAmountReceived] = useState()
  const [amountPending, setAmountPending] = useState()

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const optionsData = _.filter(data, { id: "Options" });
  const allPaymentModes = optionsData && optionsData.length > 0 && _.filter(optionsData[0].data, (item: any) => item["Payment Modes"])
  const defaultPaymentMode: any = allPaymentModes && allPaymentModes.length > 0 && _.head(allPaymentModes);

  const gymMembersData = _.filter(data, { id: "GymMembers" });

  const filteredGymMember = gymMembersData && gymMembersData.length > 0 && _.filter(gymMembersData[0].data, { "🔒 Row ID": id })
  const currentGymMember: any = (filteredGymMember && filteredGymMember.length > 0) ? filteredGymMember[0] : {}

  const [present] = useIonToast();
  const [showLoading, setShowLoading] = useState(false);
  
  useEffect(() => {
    if (!paymentMode) setPaymentMode(defaultPaymentMode && defaultPaymentMode["Payment Modes"]);
    if (isEdit && currentGymMember) {
      setName(currentGymMember["Name"])
      setEmail(currentGymMember["Email"])
      setPhone(currentGymMember["Phone"])
      currentGymMember["Joining Date"] && setJoiningDate(moment(currentGymMember["Joining Date"], "DD-MMM-YYYY").format())
      setMonths(currentGymMember["Months"])
      setPhone(currentGymMember["Phone"])
      setIsPersonalTraining(currentGymMember["IsPersonalTraining"])
      setPaymentMode(currentGymMember["Payment Mode"])
      setAmountReceived(currentGymMember["Amount Received"])
      setAmountPending(currentGymMember["Amount Pending"])
    }
  }, [defaultPaymentMode, currentGymMember]);

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

    if (!name) {
      presentToast('danger', thumbsDown, 'Please enter Member Name...')
      return;
    }
    if (!joiningDate) {
      presentToast('danger', thumbsDown, 'Please select Joining Date...')
      return;
    }
    if (!months) {
      presentToast('danger', thumbsDown, 'Please enter membership Months...')
      return;
    }

    const requestOptions: any = {
      baseURL: process.env.REACT_APP_API_BASE || '',
      url: `.netlify/functions/gymmembermgmt`,
      method: 'post',
      params: {
        itemID: id
      },
      data: {
        name: name,
        email: email,
        phone: phone,
        joiningDate: joiningDate,
        months: months || 0,
        isPersonalTraining: isPersonalTraining ? 'Yes' : '',
        paymentMode: paymentMode,
        amountReceived: amountReceived || 0,
        amountPending: amountPending || 0,
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
        window.location.href = id ? `/viewgymmember/${id}` : "/gymmembers";
      })
      .catch(function (error) {
        console.log(error);
        setShowLoading(false)
        presentToast('danger', thumbsDown, 'Sorry some error occured. Please try again to save.....')
      });
  }

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
          <IonButtons slot="start">
            <IonBackButton defaultHref={id ? `/viewgymmember/${id}` : "/gymmembers"}></IonBackButton>
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
              <IonLabel>Name</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput clearInput={true} style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setName(e.target.value)}
                value={name}
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Email</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type={'email'} clearInput={true} style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setEmail(e.target.value)}
                value={email}
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Phone</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type={'number'} clearInput={true} style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setPhone(e.target.value)}
                value={phone}
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Joining Date</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonDatetimeButton datetime="datetime" style={{ background: "var(--ion-color-light)" }}></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetime" showDefaultTitle={true} showDefaultButtons={true}
                  onIonChange={(e) => setJoiningDate(e.detail.value)}
                  value={joiningDate}
                >
                  <span slot="title">Joining Date</span>
                </IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Membership (in Months)</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput clearInput={true} style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setMonths(e.target.value)}
                value={months}
                placeholder="0"
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol><IonLabel>Payment Mode</IonLabel></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect interface="action-sheet" interfaceOptions={{ header: "Select Payment Mode" }} placeholder="Select Payment Mode"
                value={paymentMode}
                onIonChange={(e) => setPaymentMode(e.detail.value)}
                style={{ background: "var(--ion-color-light)" }}
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
              <IonInput type='number' clearInput={true} style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setAmountReceived(e.target.value)}
                value={amountReceived}
                placeholder="0"
              ></IonInput>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel>Amount Pending</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonInput type='number' clearInput={true} style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setAmountPending(e.target.value)}
                value={amountPending}
                placeholder="0"
              ></IonInput>
            </IonCol>
          </IonRow>


          <IonRow>
            <IonCol>
              <IonLabel>isPersonalTraining</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonToggle checked={!!isPersonalTraining} onIonChange={(e: any) => setIsPersonalTraining(e.detail.checked ? 'Yes' : '')}></IonToggle>
            </IonCol>
          </IonRow>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ManageGymMembers;
