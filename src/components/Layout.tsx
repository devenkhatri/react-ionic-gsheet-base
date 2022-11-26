import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Menu from './Menu';

interface LayoutProps {
  title: string;
  children: any;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Menu />
      <IonPage id="main-content">
        <IonHeader translucent={true}>
          <IonToolbar>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot="start">
              <IonMenuButton color="primary"></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{title}</IonTitle>
            </IonToolbar>
          </IonHeader>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Layout;
