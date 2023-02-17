import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonNote, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar, useIonToast } from "@ionic/react";
import { useParams } from 'react-router-dom';
import * as _ from "lodash";
import { callOutline, copyOutline, mailOutline } from "ionicons/icons";
import ProfilePhoto from "../components/ProfilePhoto";
import { refreshPage, useDataFromGoogleSheet } from "../utils";
import copy from "copy-to-clipboard";

type PageParams = {
    id?: string;
};

const ViewInquiry: React.FC = () => {
    const { id } = useParams<PageParams>();

    const title = "Inqury Details"

    const {  data, error, isFetching } = useDataFromGoogleSheet(
        process.env.REACT_APP_GOOGLE_API_KEY || "",
        process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
        [],
    );
    
    const inquriesData = _.filter(data, { id: "Inquires" });

    const filteredInquiry = inquriesData && inquriesData.length > 0 && _.filter(inquriesData[0].data, { "🔒 Row ID": id })
    const currentInquiry: any = (filteredInquiry && filteredInquiry.length > 0) ? filteredInquiry[0] : {}

    const [present] = useIonToast();
    const postCopyToClipboard = (text: any) => {
        copy(text);
        present({
            message: 'Copied to Clipboard',
            duration: 1500,
            position: 'top',
            icon: copyOutline,
            color: 'primary'
        });
    };

    return (
        <IonPage id="main-content">
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    {isFetching && <IonProgressBar type="indeterminate"></IonProgressBar>}
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={"/inquires"}></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
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
                    <IonCard style={{ textAlign: "center", paddingTop: "1rem" }}>
                        <ProfilePhoto url={currentInquiry["Photo"]} title={currentInquiry["Name"]} />
                        <IonCardHeader>
                            <IonCardTitle>{currentInquiry["Name"]}</IonCardTitle>
                            {currentInquiry["Email"] &&
                                <IonCardSubtitle>
                                    {currentInquiry["Email"]}
                                    <IonButton href={`mailto:${currentInquiry["Email"]}`} fill="clear" size="small">
                                        <IonIcon slot="icon-only" icon={mailOutline}></IonIcon>
                                    </IonButton>
                                    <IonButton fill="clear" size="small" color={'medium'} onClick={() => postCopyToClipboard(currentInquiry["Email"])}>
                                        <IonIcon slot="icon-only" icon={copyOutline}></IonIcon>
                                    </IonButton>
                                </IonCardSubtitle>
                            }
                            {currentInquiry["Phone"] &&
                                <IonCardSubtitle>
                                    {currentInquiry["Phone"]}
                                    <IonButton href={`tel:${currentInquiry["Phone"]}`} fill="clear" size="small">
                                        <IonIcon slot="icon-only" icon={callOutline}></IonIcon>
                                    </IonButton>
                                    <IonButton fill="clear" size="small" color={'medium'} onClick={() => postCopyToClipboard(currentInquiry["Phone"])}>
                                        <IonIcon slot="icon-only" icon={copyOutline}></IonIcon>
                                    </IonButton>
                                </IonCardSubtitle>
                            }
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
                </>
            </IonContent>
        </IonPage>
    );
}

export default ViewInquiry;