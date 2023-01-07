import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, useIonAlert, useIonToast } from '@ionic/react';
import axios from 'axios';
import { saveOutline, thumbsDown, thumbsUp } from 'ionicons/icons';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useGoogleSheets from 'use-google-sheets';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import ProfilePhoto from '../components/ProfilePhoto';
import { refreshPage } from '../utils';

type PageParams = {
  id?: string;
};

const ManageInquires: React.FC = () => {

  //check if the mode is edit or add
  const { id } = useParams<PageParams>();
  let isEdit = false;
  if (id) isEdit = true;

  const title = (isEdit ? "Edit" : "Add") + " Inquiry";

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState<any>(moment().format())
  const [remarks, setRemarks] = useState("")
  const [category, setCategory] = useState("Gym")

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
    sheetsOptions: [],
  });

  const optionsData = _.filter(data, { id: "Options" });
  const allInquriyCategory = optionsData && optionsData.length > 0 && _.filter(optionsData[0].data, (item: any) => item["Inquiry Category"])
  const defaultInquriyCategory: any = allInquriyCategory && allInquriyCategory.length > 0 && _.head(allInquriyCategory);

  const inquriesData = _.filter(data, { id: "Inquires" });

  const filteredInquiry = inquriesData && inquriesData.length > 0 && _.filter(inquriesData[0].data, { "🔒 Row ID": id })
  const currentInquiry: any = (filteredInquiry && filteredInquiry.length > 0) ? filteredInquiry[0] : {}

  const [present] = useIonToast();
  const [showLoading, setShowLoading] = useState(false);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (!category) setCategory(defaultInquriyCategory && defaultInquriyCategory["Inquiry Category"]);
    if (isEdit && currentInquiry) {
      setName(currentInquiry["Name"])
      setEmail(currentInquiry["Email"])
      setPhone(currentInquiry["Phone"])
      currentInquiry["Date"] && setDate(moment(currentInquiry["Date"], "DD-MMM-YYYY").format())
      setRemarks(currentInquiry["Remarks"])
    }
  }, [category, currentInquiry]);

  const presentToast = (color: any, icon: any, message: any) => {
    present({
      message: message,
      duration: 1500,
      position: 'top',
      icon: icon,
      color: color
    });
  };

  const saveRecord = async () => {

    if (!name) {
      presentToast('danger', thumbsDown, 'Please enter Member Name...')
      return;
    }
    if (!date) {
      presentToast('danger', thumbsDown, 'Please select Date...')
      return;
    }

    setShowLoading(true);

    const requestOptions: any = {
      baseURL: process.env.REACT_APP_API_BASE || '',
      url: `.netlify/functions/inquirymgmt`,
      method: 'post',
      params: {
        itemID: id
      },
      data: {
        name: name,
        email: email,
        phone: phone,
        date: date,
        remarks: remarks,
        category: category
      },
      withCredentials: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };

    axios(requestOptions)
      .then(function (response: any) {
        console.log(response);
        presentToast('success', thumbsUp, response?.data?.message || 'Saved Successfully.....');
        setShowLoading(false)
        window.location.href = id ? `/viewinquiry/${id}` : "/inquires";
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
            <IonBackButton defaultHref={id ? `/viewinquiry/${id}` : "/inquires"}></IonBackButton>
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
        <ProfilePhoto title={name} />
        <IonGrid>
          <IonRow>
            <IonCol><IonLabel>Inquiry Type</IonLabel></IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonSelect interface="action-sheet" interfaceOptions={{ header: "Select Inquiry Type" }} placeholder="Select Inquiry Type"
                value={category}
                onIonChange={(e) => setCategory(e.detail.value)}
                style={{ background: "var(--ion-color-light)" }}
              >
                {allInquriyCategory && allInquriyCategory.map((options: any) => (
                  <IonSelectOption key={options["Inquiry Category"]} value={options["Inquiry Category"]}>{options["Inquiry Category"]}</IonSelectOption>
                ))}
              </IonSelect>
            </IonCol>
          </IonRow>
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
              <IonLabel>Date</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonDatetimeButton datetime="datetime" style={{ background: "var(--ion-color-light)" }}></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime id="datetime" showDefaultTitle={true} showDefaultButtons={true}
                  onIonChange={(e) => setDate(e.detail.value)}
                  value={date}
                >
                  <span slot="title">Date</span>
                </IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Remarks</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonTextarea style={{ background: "var(--ion-color-light)" }}
                onIonInput={(e: any) => setRemarks(e.target.value)}
                value={remarks}
              ></IonTextarea>
            </IonCol>
          </IonRow>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ManageInquires;
