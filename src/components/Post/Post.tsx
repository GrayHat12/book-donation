import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonText } from "@ionic/react";
import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { Post } from "../../util/lib";
import styles from "./Post.module.css";

interface Props extends Post { };

function PostFC(props: Props) {
    return (
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>{props.book.subTitle}</IonCardSubtitle>
                <IonCardTitle>{props.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                Author : <IonText>{props.book.author}</IonText>
                <br />
                Title : <IonText>{props.book.title}</IonText>
                <br />
                Language : <IonText>{props.book.language}</IonText>
                <br />
                Contact : <a href={`tel:${props.phone}`}><IonText>{props.phone}</IonText></a>
                <br />
                {props.body}
            </IonCardContent>
        </IonCard>
    );
}

export default PostFC;