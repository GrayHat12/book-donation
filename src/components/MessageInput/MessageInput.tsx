import { IonButton, IonButtons, IonFooter, IonIcon, IonTextarea, IonToolbar } from "@ionic/react";
import { cameraOutline, sendOutline } from "ionicons/icons";
import React from "react";
import { Message } from "../../util/lib";
import styles from "./MessageInput.module.css";

interface Props {
    onSend: (message: Message) => void;
};

function MessageInput(props: Props) {
    const [text, setText] = React.useState<string | null | undefined>(undefined);
    function onSend() {
        if (typeof text === "undefined" || text === null) return;
        props.onSend({
            text: text.trim()
        });
        setText(undefined);
    }
    return (
        <IonFooter>
            <IonToolbar className={styles.toolbar}>
                <IonButtons slot="start">
                    <IonButton>
                        <IonIcon src={cameraOutline} />
                    </IonButton>
                </IonButtons>
                <IonTextarea value={text} onKeyUp={event => {
                    if (event.key === "Enter" && !(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)) onSend();
                }} onIonChange={ev => setText(ev.detail.value)} autoGrow className={styles.ta} maxlength={50} mode="ios" placeholder="Type a message" />
                <IonButtons slot="end">
                    <IonButton onClick={onSend}>
                        <IonIcon src={sendOutline} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonFooter>
    );
}

export default MessageInput;