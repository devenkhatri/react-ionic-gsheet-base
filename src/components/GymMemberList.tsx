import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonList } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import _ from "lodash";
import Avatar from "react-avatar";

const GymMemberList = ({ allGymMembers }: any) => {    
    return (
        <IonList>
            {allGymMembers && allGymMembers.map((member: any) => (
                <IonItemSliding key={member["🔒 Row ID"]}>
                    <IonItem button={true} key={member["🔒 Row ID"]} detail={true} 
                        href={`/viewgymmember/${member["🔒 Row ID"]}`}     
                        style={{borderLeft: `${member["IsPersonalTraining"]?'3px':'0px'} solid var(--ion-color-secondary)`}}
                    >
                        <IonAvatar slot="start">
                            <Avatar name={member["Name"]} round size="100%" />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{member["Name"]}</h2>
                            <p>{member["Ending Date"]}</p>
                        </IonLabel>
                        <IonLabel slot="end">{(_.toNumber(member["Amount Received"] || 0)) - (_.toNumber(member["Amount Pending"] || 0))}</IonLabel>
                    </IonItem>

                    <IonItemOptions>
                        <IonItemOption onClick={() => { window.location.href = `/managegymmember/${member["🔒 Row ID"]}` }}>
                            <IonIcon slot="top" icon={createOutline} />
                            Edit
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </IonList>
    );
}

export default GymMemberList;