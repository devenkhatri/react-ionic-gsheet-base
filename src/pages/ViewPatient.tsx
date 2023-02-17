import { IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNavLink, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar, useIonToast } from "@ionic/react";
import { useParams } from 'react-router-dom';
import * as _ from "lodash";
import { getPatientWelcomeMessage, refreshPage, sendWhatsappMessage, useDataFromGoogleSheet } from '../utils';
import { callOutline, copyOutline, logoWhatsapp, pencil } from "ionicons/icons";
import Avatar from 'react-avatar';
import ManagePatients from "./ManagePatients";
import SessionList from "../components/SessionList";
import moment from "moment";
import copy from 'copy-to-clipboard';

type PageParams = {
    id?: string;
};

const ViewPatient: React.FC = () => {
    const { id } = useParams<PageParams>();
    const fromSessionID = new URLSearchParams(window.location.search).get("fromSessionID")

    const title = "Patient Details"

    const { data, error, isFetching } = useDataFromGoogleSheet(
        process.env.REACT_APP_GOOGLE_API_KEY || "",
        process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
        [],
    );

    const sessionsData = _.filter(data, { id: "Sessions" });
    const patientsData = _.filter(data, { id: "Patients" });

    const filteredPatient = patientsData && patientsData.length > 0 && _.filter(patientsData[0].data, { "🔒 Row ID": id })
    const currentPatient: any = (filteredPatient && filteredPatient.length > 0) ? filteredPatient[0] : {}

    const filteredSession = currentPatient && sessionsData && sessionsData.length > 0 && _.filter(sessionsData[0].data, { "Patient ID": currentPatient["🔒 Row ID"] })
    const sortedSessions = filteredSession && _.orderBy(filteredSession, (item: any) => moment(item["Report: Session Date"], 'DD-MMM-YYYY'), ['desc'])

    const totalDepositAmount = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Deposit Amount"]));
    const totalAmountPending = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Amount Pending"]));
    const totalAmountPaid = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Amount Paid"]));

    // console.log("****** currentPatient[Start Date]", currentPatient["Start Date"])
    // console.log("****** moment", (currentPatient["Start Date"] && moment(currentPatient["Start Date"], 'MM/DD/YYYY').format('DD-MMM-YYYY')))

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
                        <IonBackButton defaultHref={fromSessionID ? `/viewsession/${fromSessionID}` : "/patients"}></IonBackButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonNavLink component={() => <ManagePatients />} routerDirection={"forward"}>
                            <IonButton href={`/managepatient/${id}`}>
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
                        <Avatar name={currentPatient["Name"]} round />
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
                                        <IonButton onClick={() => sendWhatsappMessage(`+91${currentPatient["Phone"]}`, getPatientWelcomeMessage(currentPatient))}>
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
                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Start Date: </h2></IonLabel>
                            <IonLabel>{currentPatient["Start Date"] && moment(currentPatient["Start Date"], 'MM/DD/YYYY').format('DD-MMM-YYYY')}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Description: </h2></IonLabel>
                            <IonLabel>{currentPatient["Description"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Referral Type: </h2></IonLabel>
                            <IonLabel>{currentPatient["Referral Type"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Referral Details: </h2></IonLabel>
                            <IonLabel>{currentPatient["Referral Details"]}</IonLabel>

                            <IonList>
                                <IonCard color={"warning"} style={{ padding: '1rem' }}>
                                    <IonCardSubtitle>Remaining Balance Amount</IonCardSubtitle>
                                    <IonLabel><h1>Rs. {totalDepositAmount - totalAmountPending}</h1></IonLabel>
                                </IonCard>
                                <IonItem>
                                    <IonLabel>Total Amount Paid:</IonLabel>
                                    <IonBadge slot="end" color={"success"}>Rs. {totalAmountPaid}</IonBadge>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Total Amount Pending:</IonLabel>
                                    <IonBadge slot="end" color={"danger"}>Rs. {totalAmountPending}</IonBadge>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Total Deposit Amount:</IonLabel>
                                    <IonBadge slot="end" color={"primary"}>Rs. {totalDepositAmount}</IonBadge>
                                </IonItem>
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                    <IonLabel><h1 style={{ padding: "1rem 1rem 0 1rem" }}>View Session Details</h1></IonLabel>
                    <SessionList allSessions={sortedSessions} fromPatientID={id} isShowDate />
                </>
            </IonContent>
        </IonPage>
    );
}

export default ViewPatient;