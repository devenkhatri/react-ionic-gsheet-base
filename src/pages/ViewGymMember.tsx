import { IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonNavLink, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useParams } from 'react-router-dom';
import useGoogleSheets from 'use-google-sheets';
import * as _ from "lodash";
import { formatCurrency, refreshPage } from '../utils';
import ListLoadingSkeleton from '../components/ListLoadingSkeleton';
import { alarmOutline, callOutline, mailOutline, pencil } from "ionicons/icons";
import ManageGymMembers from "./ManageGymMembers";
import moment from "moment";

type PageParams = {
    id?: string;
};

const ViewGymMember: React.FC = () => {
    const { id } = useParams<PageParams>();

    const title = "Gym Member Details"

    const category = process.env.REACT_APP_CATEGORY || "";
    const isGymAdminAccess = (category === "gymadmin")

    const { data, loading, error } = useGoogleSheets({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
        sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID || "",
        sheetsOptions: [],
    });

    const gymMembersData = _.filter(data, { id: "GymMembers" });

    const filteredGymMember = gymMembersData && gymMembersData.length > 0 && _.filter(gymMembersData[0].data, { "🔒 Row ID": id })
    const currentGymMember: any = (filteredGymMember && filteredGymMember.length > 0) ? filteredGymMember[0] : {}

    const daysRemaining = currentGymMember && moment(currentGymMember["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")
    let status = "primary";
    if (daysRemaining <= 0) status = "danger";
    else if (daysRemaining <= 10 * 24) status = "warning";
    else if (daysRemaining <= 30 * 24) status = "secondary"

    return (
        <IonPage id="main-content">
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    {loading && <IonProgressBar type="indeterminate"></IonProgressBar>}
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={"/gymmembers"}></IonBackButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonNavLink component={() => <ManageGymMembers />} routerDirection={"forward"}>
                            <IonButton href={`/managegymmember/${id}`}>
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
                    {/* <Avatar name={currentGymMember["Name"]} round /> */}
                    <IonCardHeader>
                        <IonCardTitle>{currentGymMember["Name"]}</IonCardTitle>
                        <IonCardSubtitle><IonIcon icon={mailOutline} /> {currentGymMember["Email"]}</IonCardSubtitle>
                        <IonCardSubtitle><IonIcon icon={callOutline} /> {currentGymMember["Phone"]}</IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonItem>
                            <IonLabel color={"medium"}>Joining Date: </IonLabel>
                            <IonLabel>{currentGymMember["Joining Date"]}</IonLabel>
                        </IonItem>

                        <IonItem>
                            <IonLabel color={"medium"}>Ending Date: </IonLabel>
                            <IonLabel>{currentGymMember["Ending Date"]}</IonLabel>
                        </IonItem>

                        <IonItem>
                            <IonLabel color={"medium"}>Payment Mode: </IonLabel>
                            <IonLabel>{currentGymMember["Payment Mode"]}</IonLabel>
                        </IonItem>

                        <IonCard>
                            <IonCardSubtitle>                                
                                <IonIcon icon={alarmOutline}></IonIcon>
                                <IonLabel>{`  Reminders`}</IonLabel>
                            </IonCardSubtitle>
                            <IonItem>
                                <IonBadge>1</IonBadge>
                                <IonLabel slot="end">{currentGymMember["Reminder-1"]}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonBadge color={'warning'}>2</IonBadge>
                                <IonLabel slot="end">{currentGymMember["Reminder-2"]}</IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonBadge color={'danger'}>3</IonBadge>
                                <IonLabel slot="end">{currentGymMember["Reminder-3"]}</IonLabel>
                            </IonItem>
                        </IonCard>

                        <IonList>
                            <IonCard color={status} style={{ padding: '1rem' }}>
                                <IonCardSubtitle>Membership {daysRemaining <= 0 ? 'Ended' : 'Ending'}</IonCardSubtitle>
                                <IonLabel><h1>{moment(currentGymMember["Ending Date"]).fromNow()}</h1></IonLabel>
                            </IonCard>
                        </IonList>
                        {isGymAdminAccess && <IonList>
                            <IonItem>
                                <IonLabel>Total Amount Received:</IonLabel>
                                <IonBadge slot="end" color={"success"}>{formatCurrency(currentGymMember["Amount Received"] || 0)}</IonBadge>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Total Amount Pending:</IonLabel>
                                <IonBadge slot="end" color={"danger"}>{formatCurrency(currentGymMember["Amount Pending"] || 0)}</IonBadge>
                            </IonItem>
                        </IonList>
                        }
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default ViewGymMember;