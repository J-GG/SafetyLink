import React, {useEffect, useState} from 'react';
import {
    IonAvatar,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import styles from './ContactList.module.css';
import ContactSearch, {Contact} from "./ContactSearch";
import {add, trash} from "ionicons/icons";
import {Storage} from "@capacitor/storage";
import {t} from "i18next";

const ContactList = (): JSX.Element => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentContacts, setCurrentContacts] = useState<Contact[]>([]);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const addSelectedContacts = (selectedContacts: Contact[]) => {
        closeModal();
        const mergedContacts = selectedContacts.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, currentContacts).sort((a, b) => {
            if (!a.name && !b.name) {
                return a.phone.localeCompare(b.phone);
            } else if (!a.name) {
                return 1;
            } else if (!b.name) {
                return -1;
            }

            return a.name.localeCompare(b.name);
        });


        Storage.set({key: "contacts", value: JSON.stringify(mergedContacts)})
        setCurrentContacts(mergedContacts);
    }

    const removeContact = (contactId: string) => {
        const updatedContacts = currentContacts.filter(contact => contact.id != contactId);
        setCurrentContacts(updatedContacts);
        Storage.set({key: "contacts", value: JSON.stringify(updatedContacts)})
    }

    useEffect(() => {
        Storage.get({key: "contacts"})
            .then(currentContacts => {
                setCurrentContacts(JSON.parse(currentContacts.value || ""));
            })
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t("contacts.title")}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{t("contacts.title")}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonList>
                    {currentContacts.map(contact => (
                        <IonItemSliding key={contact.id}>
                            <IonItem>
                                <IonAvatar slot="start">
                                    {contact.picture && <IonImg src={contact.picture}/>}
                                </IonAvatar>
                                <IonLabel>
                                    <p><strong>{contact.name}</strong></p>
                                    <p>{contact.phone}</p>
                                </IonLabel>
                            </IonItem>
                            <IonItemOptions side="start">
                                <IonItemOption color="danger" onClick={() => removeContact(contact.id)}>
                                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                                </IonItemOption>
                            </IonItemOptions>
                        </IonItemSliding>
                    ))}
                </IonList>

                <IonFab className={styles.addContactBtn}>
                    <IonFabButton onClick={openModal}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>

                <ContactSearch isOpen={isModalOpen} onClose={closeModal} onValidate={addSelectedContacts}/>
            </IonContent>
        </IonPage>
    );
};

export default ContactList;
