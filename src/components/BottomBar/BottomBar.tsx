import { IonLabel, IonTabBar, IonTabButton } from "@ionic/react";
import React from "react";

interface Props {
    selected: "need" | "give" | "settings";
};

function BottomBarFC(props: Props) {
    return (
        <IonTabBar selectedTab={props.selected} slot="bottom">
            <IonTabButton tab="need" href="/need">
                <IonLabel>Books Needed</IonLabel>
            </IonTabButton>
            <IonTabButton tab="give" href="/give">
                <IonLabel>Books for Donation</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
                <IonLabel>Settings</IonLabel>
            </IonTabButton>
        </IonTabBar>
    );
}

export default BottomBarFC;