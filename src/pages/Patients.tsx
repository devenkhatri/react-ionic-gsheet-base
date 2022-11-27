import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonList, IonNavLink, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';
import { add, ellipse, linkOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import ManagePatients from './ManagePatients';

const Patients: React.FC = () => {
  const title = "Patients"

  const names = ['Burt Bear', 'Charlie Cheetah', 'Donald Duck', 'Eva Eagle', 'Ellie Elephant', 'Gino Giraffe', 'Isabella Iguana', 'Karl Kitten', 'Lionel Lion', 'Molly Mouse', 'Paul Puppy', 'Rachel Rabbit', 'Ted Turtle'];
  const [items, setItems] = useState<{ name: string, unread: boolean }[]>([]);

  let didInit = false;

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      addItems(5);
    }
  }, []);

  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      addItems(3, true);
      event.detail.complete();
    }, 2000);
  }

  function chooseRandomName() {
    return names[Math.floor(Math.random() * names.length)];
  }

  function addItems(count: number, unread = false) {
    for (let i = 0; i < count; i++) {
      setItems((current) => [{ name: chooseRandomName(), unread }, ...current]);
    }
  }

  return (
    <IonPage id="main-content">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton color="primary"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonNavLink component={()=><ManagePatients/>} routerDirection={"forward"}>
            <IonButton href='/managepatient'>
              <IonIcon slot="icon-only" icon={add} color="primary"></IonIcon>            
            </IonButton>
            </IonNavLink>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonList>
          {items.map((item) => (
            <IonItem button={true} key={item.name}>
              <IonIcon slot="start" color="primary" icon={item.unread ? ellipse : linkOutline}></IonIcon>
              <IonLabel>
                <h2>{item.name}</h2>
                <p>New message from {item.name}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Patients;
