import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import AppBar from "../../components/AppBar/AppBar";
import BottomBarFC from "../../components/BottomBar/BottomBar";
import styles from './Home.module.css';

interface Props extends RouteComponentProps { };

function HomeFC(props: Props) {
    return (
        <IonPage>
            <AppBar title="Home"></AppBar>
            <IonContent></IonContent>
            <BottomBarFC selected="need" />
        </IonPage>
    );
}

export default HomeFC;