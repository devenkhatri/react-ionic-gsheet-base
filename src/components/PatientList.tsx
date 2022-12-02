import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonList } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import Avatar from "react-avatar";

const PatientList = ({ allPatients, fromSessionID, isShowDescription = false }: any) => {
    return (
        <IonList>
            {allPatients && allPatients.map((patient: any) => (
                <IonItemSliding key={patient["🔒 Row ID"]}>
                    <IonItem button={true} key={patient["🔒 Row ID"]} detail={true} href={`/viewpatient/${patient["🔒 Row ID"]}${fromSessionID ? `?fromSessionID=${fromSessionID}` : ``}`}>
                        <IonAvatar slot="start">
                            <Avatar name={patient["Name"]} round size="100%" />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{patient["Name"]}</h2>
                            {isShowDescription && <p>{patient["Description"]}</p>}
                        </IonLabel>
                    </IonItem>

                    <IonItemOptions>
                        <IonItemOption onClick={() => { window.location.href = `/managepatient/${patient["🔒 Row ID"]}` }}>
                            <IonIcon slot="top" icon={createOutline} />
                            Edit
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </IonList>
    );
}

export default PatientList;