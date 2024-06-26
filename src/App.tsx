import React, {useEffect} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {home, person} from 'ionicons/icons';
import Home from './pages/Home';
import ContactList from './pages/ContactList';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {SplashScreen} from "@capacitor/splash-screen";
import {i18n} from "./i18n";
import {t} from "i18next";

setupIonicReact();


const App = (): JSX.Element => {
    useEffect(() => {
        SplashScreen.show();

        new i18n()
            .load()
            .then(() => {
                SplashScreen.hide();
            })
    }, []);


    return (
        <IonApp>
            <IonReactRouter>
                <IonTabs>
                    <IonRouterOutlet>
                        <Route exact path="/home">
                            <Home/>
                        </Route>
                        <Route exact path="/contacts">
                            <ContactList/>
                        </Route>
                        <Route exact path="/">
                            <Redirect to="/home"/>
                        </Route>
                    </IonRouterOutlet>

                    <IonTabBar slot="bottom" id="testpui">
                        <IonTabButton tab="tab1" href="/home">
                            <IonIcon icon={home}/>
                            <IonLabel>{t("home.title")}</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="tab2" href="/contacts">
                            <IonIcon icon={person}/>
                            <IonLabel>{t("contacts.title")}</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                </IonTabs>
            </IonReactRouter>
        </IonApp>
    )
}

export default App;
