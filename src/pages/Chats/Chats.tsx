import { IonAvatar, IonContent, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonText } from "@ionic/react";
import { Alert } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router";
import AppBar from "../../components/AppBar/AppBar";
import BottomBarFC from "../../components/BottomBar/BottomBar";
import { useAuth } from "../../context/AuthProvider";
import { database, storage } from "../../firebase/config";
import styles from "./Chats.module.css";
import { Conversation } from "../../util/lib";

interface Props extends RouteComponentProps { };

function ChatsFC() {

    const { currentUser } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [conversations, setConversation] = React.useState<{
        uid: string,
        name: string,
        image: string,
        last: Conversation,
        hash: string,
    }[]>([]);

    async function getConversationLinks() {
        let snap = await database.ref(`/users/${currentUser?.uid}/conversations`).once('value');
        let data: { [key: string]: string } = snap.val();
        return Object.values(data);
    }
    async function getLastText(hash: string) {
        let snap = await database.ref(`/chats/${hash}/conversations`).once('value');
        let data: { [timestamp: string]: Conversation } = snap.val();
        console.log(data);
        if (!data) return null;
        let vals = Object.values(data);
        vals.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
        return vals[0];
    }
    async function getTheirName(uid: string) {
        let name = 'unknown user';
        let snap = await database.ref(`/users/${uid}/displayName`).once('value');
        if (snap.exists()) {
            name = snap.val();
            console.log(name);
        } else {
            snap = await database.ref(`/users/${uid}/name`).once('value');
            if (snap.exists()) {
                name = snap.val();
                console.log(name);
            }
        }
        return name;
    }
    async function getTheirImage(uid: string) {
        let image = 'https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png';
        let snap = await database.ref(`/users/${uid}/image`).once('value');
        if (snap.exists()) {
            image = snap.val();
        }
        return image;
    }
    async function fetchHash(hash: string) {
        let snap = await database.ref(`/chats/${hash}/user1`).once('value');
        if (snap.val() === currentUser?.uid) {
            snap = await database.ref(`/chats/${hash}/user2`).once('value');
        }
        let uid = snap.val();
        let lastText = await getLastText(hash);
        if (lastText === null) return null;
        return {
            uid: uid,
            name: await getTheirName(uid),
            image: await getTheirImage(uid),
            last: lastText,
            hash: hash
        };
    }

    async function initialise() {
        setLoading(true);
        let hashes = await getConversationLinks();
        let convs: {
            uid: string;
            name: string;
            image: string;
            last: Conversation;
            hash: string;
        }[] = [];
        for (let i = 0; i < hashes.length; i++) {
            let data = await fetchHash(hashes[i]);
            if (data !== null)
                convs.push(data);
        }
        setConversation(convs);
        setLoading(false);
    }

    React.useEffect(() => {
        initialise();
    }, []);

    return (
        <IonPage className={styles.page}>
            {loading ? <div className="sdiv">
                <div className="spinner"></div>
            </div> : null}
            <IonContent className={styles.page}>
                {error ? <Alert
                    message={error}
                    className={styles.error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                /> : null}
                {message ? <Alert
                    message={message}
                    className={styles.error}
                    type="success"
                    showIcon
                    closable
                    onClose={() => setMessage(null)}
                /> : null}
                <IonList>
                    <IonListHeader>
                        Recent Conversations
                    </IonListHeader>
                    {conversations.map(v => <IonItem key={v.hash} href={`chat/${v.hash}`}>
                        <IonAvatar slot="start">
                            <img src={v.image} alt={v.name} />
                        </IonAvatar>
                        <IonLabel>
                            <IonText>{v.name}</IonText>
                            <p>{`${v.last.from === currentUser?.uid ? "You" : v.last.from === "system" ? "System" : v.name} : ${v.last.message.text?.substring(0, 20)}...`}</p>
                        </IonLabel>
                    </IonItem>)}
                </IonList>
            </IonContent>
            <BottomBarFC selected="chat" />
        </IonPage>
    );
}

export default ChatsFC;