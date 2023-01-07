import { IonItemSliding, IonItem, IonAvatar, IonLabel, IonList } from "@ionic/react";
import Avatar from "react-avatar";

const InquiryList = ({ allInquires }: any) => {
    return (
        <IonList>
            {allInquires && allInquires.map((session: any) => (
                <IonItemSliding key={session["🔒 Row ID"]}>
                    <IonItem button={true} key={session["🔒 Row ID"]} detail={true} href={`/viewinqury/${session["🔒 Row ID"]}`}>
                        <IonAvatar slot="start">
                            <Avatar name={session["Name"]} round size="100%" />
                        </IonAvatar>
                        <IonLabel>{session["Name"]}</IonLabel>
                        <IonLabel slot='end'>{session["Date"]}</IonLabel>
                    </IonItem>
                    {/* <IonItemOptions>
                        <IonItemOption onClick={() => { window.location.href = `/managesession/${session["🔒 Row ID"]}` }}>
                            <IonIcon slot="top" icon={createOutline} />
                            Edit
                        </IonItemOption>
                    </IonItemOptions> */}
                </IonItemSliding>
            ))}
        </IonList>
    );
}

export default InquiryList;