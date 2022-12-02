import { IonItem, IonLabel, IonGrid, IonRow, IonCol } from "@ionic/react";
import _ from "lodash";
import moment from "moment";
import './PhysioReportDaywise.css'

const PhysioReportDaywise = ({ data }: any) => {
    const sortedSessions = data && data.length > 0 && _.orderBy(data[0].data, (item: any) => item["Report: Session Date"], ['desc'])
    const groupedSessions = sortedSessions && _.groupBy(sortedSessions, (item: any) => moment(item["Session Date"], "DD-MMM-YYYY, ddd").format("DD-MMM-YYYY"))

    let grandTotalCash = 0;
    let grandTotalOnline = 0;
    return (
        <>
            <IonLabel color={'primary'} class="reportTitle"><h1>Day-wise Collection Report</h1></IonLabel>
            <IonGrid>
                <IonLabel color={'primary'}>
                    <IonRow class="header">
                        <IonCol size="4">Date</IonCol>
                        <IonCol class="numberType">Cash</IonCol>
                        <IonCol class="numberType">Online</IonCol>
                        <IonCol class="numberType">Total</IonCol>
                    </IonRow>
                </IonLabel>
                {groupedSessions && _.map(groupedSessions, (sessionDetails: any, sessionDate: any) => {
                    const groupedByMode = _.groupBy(sessionDetails, (item: any) => item["Payment Mode"]);
                    const totalCash = groupedByMode["Cash"] ? _.sumBy(groupedByMode["Cash"], (session: any) => _.toNumber(session["Report: Collection Amount"])) : 0;
                    const totalOnline = groupedByMode["Online"] ? _.sumBy(groupedByMode["Online"], (session: any) => _.toNumber(session["Report: Collection Amount"])) : 0;
                    const netTotal = totalCash + totalOnline
                    grandTotalCash += totalCash
                    grandTotalOnline += totalOnline
                    return (
                        <IonRow key={sessionDate} class="itemrow">
                            <IonCol size="4">{sessionDate}</IonCol>
                            <IonCol class="numberType">{totalCash}</IonCol>
                            <IonCol class="numberType">{totalOnline}</IonCol>
                            <IonCol class="numberType">{netTotal}</IonCol>
                        </IonRow>
                    )
                })}
                <IonLabel color={'primary'}>
                    <IonRow class="footer">
                        <IonCol size="4">Total</IonCol>
                        <IonCol class="numberType">{grandTotalCash}</IonCol>
                        <IonCol class="numberType">{grandTotalOnline}</IonCol>
                        <IonCol class="numberType">{grandTotalCash + grandTotalOnline}</IonCol>
                    </IonRow>
                </IonLabel>
            </IonGrid>
        </>
    );
}

export default PhysioReportDaywise;