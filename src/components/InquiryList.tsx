import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonList, IonIcon, IonItemOption, IonItemOptions } from "@ionic/react";
import { createOutline } from "ionicons/icons";
import Avatar from "react-avatar";

const InquiryList = ({ allInquires }: any) => {
    return (
        <IonList>
            {allInquires && allInquires.map((inquiry: any) => (
                <IonItemSliding key={inquiry["🔒 Row ID"]}>
                    <IonItem button={true} key={inquiry["🔒 Row ID"]} detail={true} href={`/viewinquiry/${inquiry["🔒 Row ID"]}`}>
                        <IonAvatar slot="start">
                            <Avatar name={inquiry["Name"]} round size="100%" src={inquiry["Photo"]} />
                        </IonAvatar>
                        <IonLabel>{inquiry["Name"]}</IonLabel>
                        <IonLabel slot='end'>{inquiry["Date"]}</IonLabel>
                    </IonItem>
                    <IonItemOptions>
                        <IonItemOption onClick={() => { window.location.href = `/manageinquires/${inquiry["🔒 Row ID"]}` }}>
                            <IonIcon slot="top" icon={createOutline} />
                            Edit
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
            ))}
        </IonList>
    );
}

export default InquiryList;