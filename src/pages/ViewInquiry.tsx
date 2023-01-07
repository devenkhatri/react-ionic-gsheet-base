import { IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonNote, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useParams } from 'react-router-dom';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import {  callOutline, mailOutline } from "ionicons/icons";
import ProfilePhoto from "../components/ProfilePhoto";
import { refreshPage } from "../utils";

type PageParams = {
    id?: string;
};

const ViewInquiry: React.FC = () => {
    const { id } = useParams<PageParams>();

    const title = "Inqury Details"

    const { data, loading, error } = useGoogleSheets({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
        sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
        sheetsOptions: [],
    });

    const inquriesData = _.filter(data, { id: "Inquires" });

    const filteredInquiry = inquriesData && inquriesData.length > 0 && _.filter(inquriesData[0].data, { "🔒 Row ID": id })
    const currentInquiry: any = (filteredInquiry && filteredInquiry.length > 0) ? filteredInquiry[0] : {}

    return (
        <IonPage id="main-content">
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={"/inquires"}></IonBackButton>
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
                <IonCard style={{ textAlign: "center", paddingTop: "1rem" }}>
                    <ProfilePhoto url={currentInquiry["Photo"]} title={currentInquiry["Name"]} />
                    <IonCardHeader>
                        <IonCardTitle>{currentInquiry["Name"]}</IonCardTitle>
                        <IonCardSubtitle><IonIcon icon={mailOutline} /> {currentInquiry["Email"]}</IonCardSubtitle>
                        <IonCardSubtitle><IonIcon icon={callOutline} /> {currentInquiry["Phone"]}</IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonItem>
                            <IonLabel color={"medium"}>Inquriy Date: </IonLabel>
                            <IonLabel>{currentInquiry["Date"]}</IonLabel>
                        </IonItem>

                        <IonItem>
                            <IonLabel color={"medium"}>Inquiry For: </IonLabel>
                            <IonLabel>{currentInquiry["Category"]}</IonLabel>
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel>Remarks:</IonLabel>
                        </IonItem>
                        <IonItem lines="none">
                            <IonNote>{currentInquiry["Remarks"]}</IonNote>
                        </IonItem>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default ViewInquiry;