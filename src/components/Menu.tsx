import { IonButton, IonContent, IonHeader, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/react';

const Menu: React.FC = () => {
    return (
        <IonMenu type="push" contentId="main-content">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Aastha Health Plush</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonMenuToggle>
                    <IonButton>Close X</IonButton>
                </IonMenuToggle>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
