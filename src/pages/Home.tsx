import React, {useEffect, useState} from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToast, IonToolbar} from '@ionic/react';
import {Geolocation, Position} from '@capacitor/geolocation';
import {SmsManager} from "@byteowls/capacitor-sms";
import AlertButton from "../components/AlertButton";
import {t} from "i18next";
import {Storage} from "@capacitor/storage";
import {Contact} from "./ContactSearch";

const Home = (): JSX.Element => {
    const [location, setLocation] = useState<Position>();
    const [isAlertOn, setIsAlertOn] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isNotificationShown, setIsNotificationShown] = useState(false);

    useEffect(() => {
        Geolocation.checkPermissions()
            .then(() => {
                Geolocation.getCurrentPosition({enableHighAccuracy: true})
                    .then(position => {
                        setLocation(position);
                    })
            })
            .catch(() => setNotificationMessage(t("home.geolocation.permission.denied")))

    }, [])

    useEffect(() => {
        if (isAlertOn) {
            Storage.get({key: "contacts"})
                .then(storedContacts => {
                    const contacts: Contact[] = JSON.parse(storedContacts.value || "");
                    if (contacts.length > 0) {
                        let text = t("home.notification.content.start");
                        if (location?.coords) {
                            text += `${t("home.notification.content.position")}https://www.google.com/maps/place/${location.coords.latitude},${location.coords.longitude}`;
                        }

                        SmsManager.send({
                            numbers: [...contacts.map(contact => contact.phone)],
                            text,
                        }).then(() => {
                            setNotificationMessage(t("home.notification.success"));
                        }).catch(() => {
                            setNotificationMessage(t("home.notification.failure"));
                        }).finally(() => setIsNotificationShown(true));
                    } else {
                        setNotificationMessage(t("home.notification.empty"));
                        setIsNotificationShown(true);
                        setIsAlertOn(false);
                    }
                })

        }
    }, [isAlertOn]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t("home.title")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{t("home.title")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <AlertButton status={isAlertOn} onClick={() => setIsAlertOn(isAlertOn => !isAlertOn)}/>
                <IonToast position="bottom"
                          isOpen={isNotificationShown}
                          onDidDismiss={() => setIsNotificationShown(false)}
                          message={notificationMessage}
                          buttons={[{
                              text: 'X',
                              role: 'cancel',
                          }]}
                          duration={3000}/>
            </IonContent>
        </IonPage>
    );
};

export default Home;
