import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonList } from "@ionic/react";
import { createOutline, logoWhatsapp, shareOutline } from "ionicons/icons";
import Avatar from "react-avatar";
import { RWebShare } from "react-web-share";
import { getWelcomeMessage, sendWhatsappMessage } from "../utils";

const GymMemberList = ({ allGymMembers }: any) => {
    // console.log("******* ", allGymMembers)
    return (
        <IonList>
            {allGymMembers && allGymMembers.map((member: any) => (
                <IonItemSliding key={member["🔒 Row ID"]}>
                    <IonItem button={true} key={member["🔒 Row ID"]} detail={true}
                        href={`/viewgymmember/${member["🔒 Row ID"]}`}
                        style={{ borderLeft: `${member["IsPersonalTraining"] ? '3px' : '0px'} solid var(--ion-color-secondary)` }}
                    >
                        <IonAvatar slot="start">
                            <Avatar name={member["Name"]} round size="100%" src={member["Profile Photo"]} />
                        </IonAvatar>
                        <IonLabel>
                            <h2>{member["Name"]}</h2>
                            <p>{member["Phone"]}</p>
                        </IonLabel>
                        <IonLabel slot="end">{member["Ending Date"]}</IonLabel>
                    </IonItem>

                    <IonItemOptions>
                        {/* {member["Phone"] && <IonItemOption onClick={() => sendWhatsappMessage(`+91${member["Phone"]}`, getWelcomeMessage(member))}>
                            <IonIcon slot="icon-only" icon={logoWhatsapp} />
                        </IonItemOption>
                        } */}
                        <RWebShare
                            data={{
                                text: getWelcomeMessage(member),
                                url: "https://aastha-health.business.site/",
                                title: "Send Gym Membership Details",
                            }}
                            onClick={() => console.log("shared successfully!")}
                        >
                            <IonItemOption>
                                <IonIcon slot="icon-only" icon={shareOutline} ></IonIcon>
                            </IonItemOption>
                        </RWebShare>
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