import { IonItem, IonLabel, IonList, IonSkeletonText } from "@ionic/react";
import * as _ from "lodash";

const ListLoadingSkeleton = () => {

    return (
        <IonList>
            {_.times(25, () => (
                <IonItem>
                    <IonLabel>
                        <h1><IonSkeletonText animated={true} style={{ 'width': '80%' }} /></h1>
                        <p><IonSkeletonText animated={true} style={{ 'width': '100%' }} /></p>
                        <p><IonSkeletonText animated={true} style={{ 'width': '100%' }} /></p>
                    </IonLabel>
                </IonItem>
            ))}

        </IonList>
    );
}

export default ListLoadingSkeleton;