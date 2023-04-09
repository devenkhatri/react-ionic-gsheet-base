import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useParams } from 'react-router-dom';
import * as _ from "lodash";
import { refreshPage, useDataFromGoogleSheet } from '../utils';
import moment from "moment";
import WellnessSessionList from "../components/WellnessSessionList";
import ProfilePhoto from "../components/ProfilePhoto";

type PageParams = {
    id?: string;
};

const WellnessPatientSummary: React.FC = () => {
    const { id } = useParams<PageParams>();

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

    return (
        <IonPage id="main-content">
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>{process.env.REACT_APP_TITLE} - {title}</IonTitle>
                    {isFetching && <IonProgressBar type="indeterminate"></IonProgressBar>}
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
                        </IonCardHeader>

                        <IonCardContent>
                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Start Date: </h2></IonLabel>
                            <IonLabel>{currentPatient["Start Date"] && moment(currentPatient["Start Date"], 'MM/DD/YYYY').format('DD-MMM-YYYY')}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Treatment Description: </h2></IonLabel>
                            <IonLabel>{currentPatient["Treatment Description"]}</IonLabel>

                            <IonLabel color={"dark"}><h2 style={{ paddingTop: "0.5rem" }}>Treatment Total Sessions: </h2></IonLabel>
                            <IonLabel>{currentPatient["Treatment Total Sessions"]}</IonLabel>

                            <IonList>
                                <IonCard color={remainingStyle} style={{ padding: '1rem' }}>
                                    <IonCardSubtitle>Sittings Remaining</IonCardSubtitle>
                                    <IonLabel><h1>{remaining}</h1></IonLabel>
                                </IonCard>
                            </IonList>
                        </IonCardContent>
                    </IonCard>
                    <IonLabel><h1 style={{ padding: "1rem 1rem 0 1rem" }}>Session Details</h1></IonLabel>
                    <WellnessSessionList allSessions={sortedSessions} fromPatientID={id} isShowDate isViewOnly />
                </>
            </IonContent>
        </IonPage>
    );
}

export default WellnessPatientSummary;