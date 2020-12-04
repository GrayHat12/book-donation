import { Toast } from "@capacitor/core";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonRouterLink, IonText } from "@ionic/react";
import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { database } from "../../firebase/config";
import { Post } from "../../util/lib";
import styles from "./Post.module.css";

interface Props extends Post {
    id: string;
    type: "give" | "need",
    onDelete: () => any;
};

function PostFC(props: Props) {
    const { currentUser } = useAuth();
    async function deletePost() {
        try {
            await database.ref(`${props.type}/${props.id}`).remove();
            Toast.show({
                text: "Deleted your post",
                duration: "long",
                position: "center"
            });
        } catch (err) {
            console.error(err);
            Toast.show({
                text: `Error : ${err.message}`,
                duration: "long",
                position: "center"
            });
        }
        props.onDelete();
    }
    function hash(from: string | undefined, to: string) {
        if (typeof from === "undefined") {
            return "";
        }
        if (from.localeCompare(to) < to.localeCompare(from)) {
            return from + ":" + to;
        } else {
            return to + ":" + from;
        }
    }
    return (
        <IonCard className={currentUser?.uid === props.author ? styles.isAuth : styles.isNAuth}>
            <IonCardHeader>
                <div className={styles.space}>
                    <img className={styles.img} src={props.book.image} alt={props.book.title} />
                    {currentUser?.uid === props.author ?
                        <img className={styles.delete} onClick={deletePost} src="https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/82-512.png" alt="delete" />
                        :
                        <IonRouterLink href={`chat/${hash(currentUser?.uid, props.author)}`}>
                            <img className={styles.delete} src="https://img.icons8.com/cotton/2x/chat.png" alt="chat" />
                        </IonRouterLink>
                    }
                </div>
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