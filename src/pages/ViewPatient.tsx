import { IonAvatar, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNavLink, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useParams } from 'react-router-dom';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import { pencil } from "ionicons/icons";
import Avatar from 'react-avatar';
import ManagePatients from "./ManagePatients";

type PageParams = {
    id?: string;
};

const ViewPatient: React.FC = () => {
    const { id } = useParams<PageParams>();
    const fromSessionID = new URLSearchParams(window.location.search).get("fromSessionID")

    const title = "Patient Details"

    const { data, loading, error } = useGoogleSheets({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
        sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
        sheetsOptions: [],
    });

    const sessionsData = _.filter(data, { id: "Sessions" });
    const patientsData = _.filter(data, { id: "Patients" });

    const filteredPatient = patientsData && patientsData.length > 0 && _.filter(patientsData[0].data, { "🔒 Row ID": id })
    const currentPatient: any = (filteredPatient && filteredPatient.length > 0) ? filteredPatient[0] : {}

    const filteredSession = currentPatient && sessionsData && sessionsData.length > 0 && _.filter(sessionsData[0].data, { "Patient ID": currentPatient["🔒 Row ID"] })
    const sortedSessions = filteredSession && _.orderBy(filteredSession, (item: any) => item["Report: Session Date"], ['desc'])

    const totalDepositAmount = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Deposit Amount"]));
    const totalAmountPending = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Amount Pending"]));
    const totalAmountPaid = _.sumBy(sortedSessions, (session: any) => _.toNumber(session["Amount Paid"]));

    return (
        <IonPage id="main-content">
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>                    
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
                    <Avatar name={currentPatient["Name"]} round />
                    <IonCardHeader>
                        <IonCardTitle>{currentPatient["Name"]}</IonCardTitle>
                        <IonCardSubtitle>{currentPatient["Phone"]}</IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Start Date: </h2></IonLabel>
                        <IonLabel>{currentPatient["Start Date"]}</IonLabel>

                        <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Description: </h2></IonLabel>
                        <IonLabel>{currentPatient["Description"]}</IonLabel>

                        <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Referral Type: </h2></IonLabel>
                        <IonLabel>{currentPatient["Referral Type"]}</IonLabel>

                        <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Referral Details: </h2></IonLabel>
                        <IonLabel>{currentPatient["Referral Details"]}</IonLabel>

                        <IonList>
                            <IonCard color={"warning"} style={{padding: '1rem'}}>
                                <IonCardSubtitle>Remaining Balance Amount</IonCardSubtitle>
                                <IonLabel><h1>Rs. {totalDepositAmount-totalAmountPending}</h1></IonLabel>
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
                <IonList>
                    {sortedSessions && sortedSessions.map((session: any) => (
                        <IonItem button={true} key={session["🔒 Row ID"]} detail={true} href={`/viewsession/${session["🔒 Row ID"]}?fromPatientID=${id}`}>
                            <IonAvatar slot="start">
                                <Avatar name={session["Report: Patient Name"]} round size="100%" />
                            </IonAvatar>
                            <IonLabel>
                                <h2>{session["Report: Patient Name"]}</h2>
                                <p>{session["Report: Session Date"]}</p>
                            </IonLabel>

                            <IonLabel slot='end'>{session["Report: Collection Amount"]}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default ViewPatient;