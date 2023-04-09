import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonList } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import Avatar from "react-avatar";

const WellnessSessionList = ({ allSessions, fromPatientID, isShowDate = false, isViewOnly = false }: any) => {
    return (
        <IonList>
            {allSessions && allSessions.map((session: any) => {
                const detailLink = `/viewwellnesssession/${session["🔒 Row ID"]}${fromPatientID ? `?fromPatientID=${fromPatientID}` : ``}`;
                return (
                    <IonItemSliding key={session["🔒 Row ID"]}>
                        <IonItem button={!isViewOnly} key={session["🔒 Row ID"]} detail={!isViewOnly} href={isViewOnly ? undefined : detailLink}>
                            {!isViewOnly && <IonAvatar slot="start">
                                <Avatar name={session["Report: Patient Name"]} round size="100%" src={session["Report: Profile Photo"]} />
                            </IonAvatar>
                            }
                            <IonLabel>
                                <h2>{session["Report: Patient Name"]}</h2>
                                {isShowDate && <p>{session["Session Date"]}</p>}
                                <p>{session["Session Description"]}</p>
                            </IonLabel>
                            <IonLabel slot='end'>{session["Sittings Used"]}</IonLabel>
                        </IonItem>
                        {!isViewOnly && <IonItemOptions>
                            <IonItemOption onClick={() => { window.location.href = `/managewellnesssession/${session["🔒 Row ID"]}` }}>
                                <IonIcon slot="top" icon={createOutline} />
                                Edit
                            </IonItemOption>
                        </IonItemOptions>
                        }
                    </IonItemSliding>
                )
            })}
        </IonList>
    );
}

export default WellnessSessionList;