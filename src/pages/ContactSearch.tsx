import React, {useEffect, useState} from 'react';
import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSearchbar,
    IonSkeletonText,
    IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './ContactList.module.css';
import {checkmark, close} from "ionicons/icons";
import {Contacts} from "@capacitor-community/contacts";
import {t} from "i18next";

interface ContactListProps {
    isOpen: boolean,
    onClose: () => void,
    onValidate: (contacts: Contact[]) => void
}

export class Contact {
    id: string;
    phone: string;
    name?: string;
    picture?: string;

    constructor(id: string, phone: string, name?: string, picture?: string) {
        this.id = id + phone.replaceAll(/\s/g, '') || "";
        this.phone = phone;
        this.name = name;
        this.picture = picture;
    }
}

const retrieveListOfContacts = async () => {
    return Contacts.getContacts({
        projection: {
            name: true,
            phones: true,
            image: true
        },
    });
};

const ContactSearch = ({isOpen, onClose, onValidate}: ContactListProps): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [phoneContacts, setPhoneContacts] = useState<Contact[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])

    const onSelectedContact = (contactId: string, selected: boolean) => {
        if (!selected) {
            setSelectedContacts(selectedContacts.filter(contact => contact.id != contactId));
        } else {
            const foundContact = phoneContacts.findLast(contact => contact.id == contactId);
            if (foundContact) {
                setSelectedContacts([...selectedContacts, foundContact]);
            }
        }
    }

    useEffect(() => {
        retrieveListOfContacts()
            .then(response => {
                setIsLoading(false);

                const contacts = response.contacts
                    .flatMap(contact => {
                        if (contact.phones) {
                            const phoneNumbers = contact.phones.map(phone => phone.number?.replaceAll(/\s/g, ''));

                            return phoneNumbers
                                .filter((phoneNumber, index) => phoneNumber && phoneNumbers.indexOf(phoneNumber) === index)
                                .map(phoneNumber =>
                                    new Contact(contact.contactId, phoneNumber || "", contact.name?.display || undefined, contact.image?.base64String || undefined));
                        }
                        return [];
                    }).sort((a, b) => {
                        if (!a.name && !b.name) {
                            return a.phone.localeCompare(b.phone);
                        } else if (!a.name) {
                            return 1;
                        } else if (!b.name) {
                            return -1;
                        }

                        return a.name.localeCompare(b.name);
                    });

                setPhoneContacts(contacts);
                setFilteredContacts(contacts);
            })
    }, [])

    useEffect(() => {
        setSearchText("");
        setSelectedContacts([]);
        setFilteredContacts(phoneContacts);
    }, [isOpen]);

    useEffect(() => {
        const filteredContacts = phoneContacts.filter(contact => {
            const searchableData = contact.phone.concat(contact.name || "");
            return searchableData.toLowerCase().search(searchText) != -1;
        });
        setFilteredContacts(filteredContacts);
    }, [searchText]);

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t("contactSearch.title")}</IonTitle>
                    <IonButtons slot="end">
                        {selectedContacts.length > 0 &&
                            <IonButton onClick={() => onValidate(selectedContacts)}>
                                <IonIcon size="large" icon={checkmark}></IonIcon>
                            </IonButton>
                        }
                        <IonButton onClick={onClose}>
                            <IonIcon size="large" icon={close}></IonIcon>
                        </IonButton>
                    </IonButtons>

                </IonToolbar>

                <IonToolbar>
                    <IonSearchbar placeholder={t("contactSearch.input.placeholder")}
                                  onIonInput={(text) => setSearchText(text.target.value?.toLowerCase() || "")}>
                    </IonSearchbar>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {isLoading ?
                    (
                        <IonList>
                            {[...Array(10).keys()].map(value => (
                                <IonItem key={value}>
                                    <IonThumbnail slot="start">
                                        <IonSkeletonText animated={true}></IonSkeletonText>
                                    </IonThumbnail>
                                    <IonLabel>
                                        <p>
                                            <IonSkeletonText animated={true} style={{width: "50%"}}></IonSkeletonText>
                                        </p>
                                        <p>
                                            <IonSkeletonText animated={true} style={{width: "25%"}}></IonSkeletonText>
                                        </p>
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    )
                    :
                    (
                        <IonList>
                            {filteredContacts.map(contact => (
                                <IonItem key={contact.id}>
                                    <IonAvatar slot="start">
                                        {contact.picture && <IonImg src={contact.picture}/>}
                                    </IonAvatar>
                                    <IonLabel>
                                        <p><strong>{contact.name}</strong></p>
                                        <p>{contact.phone}</p>
                                    </IonLabel>
                                    <IonCheckbox slot="end"
                                                 onIonChange={(e) => onSelectedContact(contact.id, e.target.checked)}></IonCheckbox>
                                </IonItem>
                            ))}
                        </IonList>
                    )
                }
            </IonContent>
        </IonModal>
    );
};

export default ContactSearch;