import { IonLabel, IonGrid, IonRow, IonCol } from "@ionic/react";
import _ from "lodash";
import moment from "moment";
import { formatCurrency } from "../utils";
import './ReportDaywise.css'

const PhysioReportDaywise = ({ data }: any) => {
    const sortedSessions = data && data.length > 0 && _.orderBy(data[0].data, (item: any) => moment(item["Report: Session Date"], 'DD-MMM-YYYY'), ['desc'])
    const groupedSessions = sortedSessions && _.groupBy(sortedSessions, (item: any) => moment(item["Session Date"], "DD-MMM-YYYY, ddd").format("DD-MMM-YYYY"))

    let grandTotalCash = 0;
    let grandTotalOnline = 0;

    return (
        <>
            <IonLabel color={'primary'} class="reportTitle"><h1>Day-wise Collection Report</h1></IonLabel>
            <IonGrid>
                <IonLabel color={'primary'}>
                    <IonRow class="header">
                        <IonCol size="3">Date</IonCol>
                        <IonCol size="3" class="numberType">Cash</IonCol>
                        <IonCol size="3" class="numberType">Online</IonCol>
                        <IonCol size="3" class="numberType">Total</IonCol>
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
                            <IonCol size="3">{sessionDate}</IonCol>
                            <IonCol size="3" class="numberType">{formatCurrency(totalCash)}</IonCol>
                            <IonCol size="3" class="numberType">{formatCurrency(totalOnline)}</IonCol>
                            <IonCol size="3" class="numberType">{formatCurrency(netTotal)}</IonCol>
                        </IonRow>
                    )
                })}
                <IonLabel color={'primary'}>
                    <IonRow class="footer">
                        <IonCol size="3">Total</IonCol>
                        <IonCol size="3" class="numberType">{formatCurrency(grandTotalCash)}</IonCol>
                        <IonCol size="3" class="numberType">{formatCurrency(grandTotalOnline)}</IonCol>
                        <IonCol size="3" class="numberType">{formatCurrency(grandTotalCash + grandTotalOnline)}</IonCol>
                    </IonRow>
                </IonLabel>
            </IonGrid>
        </>
    );
}

export default PhysioReportDaywise;