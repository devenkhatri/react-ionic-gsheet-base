import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonList } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import Avatar from "react-avatar";

const SessionList = ({ allSessions, fromPatientID, isShowDate = false, isViewOnly = false }: any) => {
    return (
        <IonList>
            {allSessions && allSessions.map((session: any) => (
                <IonItemSliding key={session["🔒 Row ID"]}>
                    <IonItem button={true} key={session["🔒 Row ID"]} detail={!isViewOnly} disabled={isViewOnly} href={`/viewsession/${session["🔒 Row ID"]}${fromPatientID ? `?fromPatientID=${fromPatientID}` : ``}`}>
                        <IonAvatar slot="start">
                            <Avatar name={session["Report: Patient Name"]} round size="100%" />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{session["Report: Patient Name"]}</h2>
                            {isShowDate && <p>{session["Report: Session Date"]}</p>}
                        </IonLabel>
                        <IonLabel slot='end'>{session["Report: Collection Amount"]}</IonLabel>
                    </IonItem>
                    {!isViewOnly && <IonItemOptions>
                        <IonItemOption onClick={() => { window.location.href = `/managesession/${session["🔒 Row ID"]}` }}>
                            <IonIcon slot="top" icon={createOutline} />
                            Edit
                        </IonItemOption>
                    </IonItemOptions>
                    }
                </IonItemSliding>
            ))}
        </IonList>
    );
}

export default SessionList;