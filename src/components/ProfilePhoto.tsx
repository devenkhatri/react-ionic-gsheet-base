import { createAnimation, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { close } from "ionicons/icons";
import { useState } from "react";
import Avatar from "react-avatar";

const ProfilePhoto = ({ url, title }: any) => {
    let profilePhotoUrl: any = url || `https://ionicframework.com/docs/img/demos/avatar.svg`;

    const [isProfilePhotoOpen, setIsProfilePhotoOpen] = useState(false);

    const enterAnimation = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const backdropAnimation = createAnimation()
            .addElement(root?.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(root?.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' },
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(400)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: HTMLElement) => {
        return enterAnimation(baseEl).direction('reverse');
    };

    return (
        <>
            <Avatar
                name={title}
                src={profilePhotoUrl}
                round
                style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }}
                onClick={() => { setIsProfilePhotoOpen(true) }}
            />
            <IonModal
                isOpen={isProfilePhotoOpen}
                enterAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
            >
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{title || "Profile Photo"}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsProfilePhotoOpen(false)}>
                                <IonIcon icon={close} />Close
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonImg src={profilePhotoUrl} />
                </IonContent>
            </IonModal></>
    );
}

export default ProfilePhoto;