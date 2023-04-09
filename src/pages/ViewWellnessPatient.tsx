import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNavLink, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar, useIonToast } from "@ionic/react";
import { useParams } from 'react-router-dom';
import * as _ from "lodash";
import { getWellnessPatientWelcomeMessage, refreshPage, sendWhatsappMessage, useDataFromGoogleSheet } from '../utils';
import { callOutline, copyOutline, logoWhatsapp, pencil } from "ionicons/icons";
import moment from "moment";
import copy from 'copy-to-clipboard';
import ManageWellnessPatients from "./ManageWellnessPatients";
import WellnessSessionList from "../components/WellnessSessionList";
import ProfilePhoto from "../components/ProfilePhoto";

type PageParams = {
    id?: string;
};

const ViewWellnessPatient: React.FC = () => {
    const { id } = useParams<PageParams>();
    const fromSessionID = new URLSearchParams(window.location.search).get("fromSessionID")

    const title = "Wellness Patient Details"

    const { data, error, isFetching } = useDataFromGoogleSheet(
        process.env.REACT_APP_GOOGLE_API_KEY || "",
        process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
        [],
    );

    const sessionsData = _.filter(data, { id: "WellnessSessions" });
    const patientsData = _.filter(data, { id: "WellnessPatients" });

    const filteredPatient = patientsData && patientsData.length > 0 && _.filter(patientsData[0].data, { "🔒 Row ID": id })
    const currentPatient: any = (filteredPatient && filteredPatient.length > 0) ? filteredPatient[0] : {}

    const filteredSession = currentPatient && sessionsData && sessionsData.length > 0 && _.filter(sessionsData[0].data, { "Patient ID": currentPatient["🔒 Row ID"] })
    const sortedSessions = filteredSession && _.orderBy(filteredSession, (item: any) => moment(item["Report: Session Date"], 'DD-MMM-YYYY'), ['desc'])

    const totalTreatmentSessions = currentPatient["Treatment Total Sessions"] || 0;
    const totalSittings = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Sittings"]));
    const remaining = totalTreatmentSessions - totalSittings;
    const remainingStyle = remaining === 0 ? 'warning' : (remaining > 0 ? 'success' : 'danger');

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
                        <IonBackButton defaultHref={fromSessionID ? `/viewwellnesssession/${fromSessionID}` : "/wellnesspatients"}></IonBackButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonNavLink component={() => <ManageWellnessPatients />} routerDirection={"forward"}>
                            <IonButton href={`/managewellnesspatient/${id}`}>
                                <IonIcon slot="icon-only" icon={pencil} color="primary"></IonIcon>
                            </IonButton>
                        </IonNavLink>
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
                        <ProfilePhoto url={currentPatient["Profile Photo"]} title={currentPatient["Name"]} />
                        <IonCardHeader>
                            <IonCardTitle>{currentPatient["Name"]}</IonCardTitle>
                            <IonCardSubtitle>
                                {currentPatient["Phone"]}
                            </IonCardSubtitle>
                            {currentPatient["Phone"] &&
                                <>
                                    <IonButton href={`tel:${currentPatient["Phone"]}`} fill="clear" size="small">
                                        <IonIcon slot="icon-only" icon={callOutline}></IonIcon>
                                    </IonButton>
                                    {currentPatient["Phone"] &&
                                        <IonButton fill="clear" size="small" onClick={() => sendWhatsappMessage(`+91${currentPatient["Phone"]}`, getWellnessPatientWelcomeMessage(currentPatient))}>
                                            <IonIcon color="primary" icon={logoWhatsapp} />
                                        </IonButton>
                                    }
                                    <IonButton fill="clear" size="small" color={'medium'} onClick={() => postCopyToClipboard(currentPatient["Phone"])}>
                                        <IonIcon slot="icon-only" icon={copyOutline}></IonIcon>
                                    </IonButton>
                                </>
                            }
                        </IonCardHeader>

                        <IonCardContent>
                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Treatment Start Date: </h2></IonLabel>
                            <IonLabel>{currentPatient["Start Date"] && moment(currentPatient["Start Date"], 'MM/DD/YYYY').format('DD-MMM-YYYY')}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Treatment Description: </h2></IonLabel>
                            <IonLabel>{currentPatient["Treatment Description"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Treatment Total Sessions: </h2></IonLabel>
                            <IonLabel>{currentPatient["Treatment Total Sessions"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Treatment Total Charges: </h2></IonLabel>
                            <IonLabel>{currentPatient["Treatment Total Charges"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Occupation: </h2></IonLabel>
                            <IonLabel>{currentPatient["Occupation"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Referral Type: </h2></IonLabel>
                            <IonLabel>{currentPatient["Referral Type"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Referral Details: </h2></IonLabel>
                            <IonLabel>{currentPatient["Referral Details"]}</IonLabel>

                            <IonList>
                                <IonCard color={remainingStyle} style={{ padding: '1rem' }}>
                                    <IonCardSubtitle>Sittings Remaining</IonCardSubtitle>
                                    <IonLabel><h1>{remaining}</h1></IonLabel>
                                </IonCard>
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                    <IonLabel><h1 style={{ padding: "1rem 1rem 0 1rem" }}>View Wellness Session Details</h1></IonLabel>
                    <WellnessSessionList allSessions={sortedSessions} fromPatientID={id} isShowDate />
                </>
            </IonContent>
        </IonPage>
    );
}

export default ViewWellnessPatient;