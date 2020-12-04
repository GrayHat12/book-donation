import { IonButton, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useAuth } from "../../context/AuthProvider";
import styles from "./AppBar.module.css";

interface Props {
    title: string;
};

function AppBar(props: Props) {
    const { logout } = useAuth();
    async function onLogout() {
        await logout();
    }
    return (
        <IonHeader>
            <IonToolbar className={styles.toolbar}>
                <IonTitle className={styles.title}>{props.title}</IonTitle>
                <IonButton fill="solid" onClick={onLogout} slot="end" className={styles.button}>
                    Logout
                </IonButton>
            </IonToolbar>
        </IonHeader>
    );
}

export default AppBar;