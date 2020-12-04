import { IonBackButton, IonButtons, IonHeader, IonImg, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import styles from "./ChatBar.module.css";

interface Props {
    title: string;
    image: string;
    messageCount: number;
};

function ChatBar(props: Props) {
    return (
        <IonHeader>
            <IonToolbar className={styles.toolbar}>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/chats" />
                    <IonImg className={styles.image} src={props.image} />
                </IonButtons>
                <IonTitle className={styles.title}>{props.title}<br /><span className={styles.sub}>{props.messageCount} messages</span></IonTitle>
            </IonToolbar>
        </IonHeader>
    );
}

export default ChatBar;