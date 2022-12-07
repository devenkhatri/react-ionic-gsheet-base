import { IonAvatar, IonButton, IonButtons, IonIcon, IonItem, IonItemSliding, IonLabel, IonList } from "@ionic/react";
import { alarmOutline, logoWhatsapp } from "ionicons/icons";
import _ from "lodash";
import moment from "moment";
import Avatar from "react-avatar";
import { RWebShare } from "react-web-share";
import './PhysioReportDaywise.css'

const GymReportExpiringList = ({ data }: any) => {

    const sortedGymMembers = data && data.length > 0 && _.orderBy(data[0].data, (item: any) => moment(item["Ending Date"], "DD-MMM-YYYY"))
    const filtedMember_2Days = sortedGymMembers && _.filter(sortedGymMembers, (item: any) => (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) > 0 && (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) <= 2 * 24)
    const filtedMember_7Days = sortedGymMembers && _.filter(sortedGymMembers, (item: any) => (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) > 2 * 24 && (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) <= 7 * 24)
    const filtedMember_15Days = sortedGymMembers && _.filter(sortedGymMembers, (item: any) => (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) > 7 * 24 && (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) <= 15 * 24)
    const filtedMember_30Days = sortedGymMembers && _.filter(sortedGymMembers, (item: any) => (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) > 15 * 24 && (moment(item["Ending Date"], 'DD-MMM-YYYY').diff(moment(), "hours")) <= 30 * 24)

    const sendWhatsappMessage = (mobileNumber: any, message: any) => {

        // Regex expression to remove all characters which are NOT alphanumeric
        let number = mobileNumber.replace(/[^\w\s]/gi, "").replace(/ /g, "");

        // Appending the phone number to the URL
        let url = `https://api.whatsapp.com/send?phone=${number}`;

        // Appending the message to the URL by encoding it
        url += `&text=${encodeURI(message)}&app_absent=0`;

        // Open our newly created URL in a new tab to send the message
        window.open(url);
    };

    const ShowExpiringMemberList = ({ items, title }: any) => {
        if (!items || items.length <= 0) return <></>;
        return (
            <IonList>
                <IonItem color={'primary'}>{title}</IonItem>
                {items && items.map((member: any) => (
                    <IonItemSliding key={member["🔒 Row ID"]}>
                        <IonItem button={false} key={member["🔒 Row ID"]} detail={false}
                            // href={`/viewgymmember/${member["🔒 Row ID"]}`}
                            style={{ borderLeft: `${member["IsPersonalTraining"] ? '3px' : '0px'} solid var(--ion-color-secondary)` }}
                        >
                            <IonAvatar slot="start">
                                <Avatar name={member["Name"]} round size="100%" />
                            </IonAvatar>
                            <IonLabel>
                                <h2>{member["Name"]}</h2>
                                <p>{member["Ending Date"]}</p>
                            </IonLabel>
                            <IonButtons slot="end">                                
                                {member["Phone"] &&
                                    <IonButton onClick={() => sendWhatsappMessage(`+91${member["Phone"]}`, `Dear ${member["Name"]}, This is a reminder to let you know that your Gym Membership at Aastha Health Plus is ending soon on '${member["Ending Date"]}'`)}>
                                        <IonIcon icon={logoWhatsapp} />
                                    </IonButton>
                                }
                                <RWebShare
                                    data={{
                                        text: `Dear ${member["Name"]}, This is a reminder to let you know that your Gym Membership at Aastha Health Plus is ending soon on '${member["Ending Date"]}'`,
                                        url: "https://aastha-health.business.site/",
                                        title: "Send Gym Membership Expiration Remainder",
                                    }}
                                    onClick={() => console.log("shared successfully!")}
                                >
                                    <IonButton>
                                        <IonIcon slot="icon-only" icon={alarmOutline} ></IonIcon>
                                    </IonButton>
                                </RWebShare>
                            </IonButtons>
                        </IonItem>
                    </IonItemSliding>
                ))}
            </IonList>
        );
    }

    return (
        <>
            <IonLabel color={'primary'} class="reportTitle"><h1>Memberships Expiring Soon - Report</h1></IonLabel>

            {filtedMember_2Days && <ShowExpiringMemberList items={filtedMember_2Days} title="Expiring in 2 days" />}
            {filtedMember_7Days && <ShowExpiringMemberList items={filtedMember_7Days} title="Expiring in 7 days" />}
            {filtedMember_15Days && <ShowExpiringMemberList items={filtedMember_15Days} title="Expiring in 15 days" />}
            {filtedMember_30Days && <ShowExpiringMemberList items={filtedMember_30Days} title="Expiring in 30 days" />}
        </>
    );
}

export default GymReportExpiringList;