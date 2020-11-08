import { IonButton, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useAuth } from "../../context/AuthProvider";
import styles from "./AppBar.module.css";

interface Props {
    title: string;
};

function AppBar(props: Props) {
    const { currentUser, logout } = useAuth();
    async function onLogout() {
        await logout();
    }
    return (
        <IonHeader>
            <IonToolbar className={styles.toolbar}>
                <IonButton className={styles.button} slot="start" fill="clear" href="/home">
                    HOME
                </IonButton>
                <IonTitle className={styles.title}>{props.title} - {currentUser?.displayName}</IonTitle>
                <IonButton fill="clear" onClick={onLogout} slot="end" className={styles.button}>
                    <img className={styles.logout} src="https://cdn.onlinewebfonts.com/svg/img_356268.png" alt="logout"></img>
                </IonButton>
            </IonToolbar>
        </IonHeader>
    );
}

export default AppBar;