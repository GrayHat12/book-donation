import { IonIcon, IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import {
    arrowDownCircleOutline,
    arrowUpCircleOutline,
    chatbubbleOutline,
    settingsOutline
} from "ionicons/icons";
import React from "react";

interface Props {
    selected: "need" | "give" | "settings" | "chat";
};

function BottomBarFC(props: Props) {
    return (
        <IonTabBar selectedTab={props.selected} slot="bottom">
            <IonTabButton tab="need" href="/need">
                <IonLabel>Books Needed</IonLabel>
                <IonIcon src={arrowDownCircleOutline}></IonIcon>
            </IonTabButton>
            <IonTabButton tab="give" href="/give">
                <IonLabel>Books for Donation</IonLabel>
                <IonIcon src={arrowUpCircleOutline}></IonIcon>
            </IonTabButton>
            <IonTabButton tab="chat" href="/chats">
                <IonLabel>Chat</IonLabel>
                <IonIcon src={chatbubbleOutline}></IonIcon>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
                <IonLabel>Settings</IonLabel>
                <IonIcon src={settingsOutline}></IonIcon>
            </IonTabButton>
        </IonTabBar>
    );
}

export default BottomBarFC;