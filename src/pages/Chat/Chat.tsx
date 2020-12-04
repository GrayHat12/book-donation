import { IonContent, IonPage } from "@ionic/react";
import { Alert } from "antd";
import React from "react";
import { RouteComponentProps } from "react-router";
import ChatBar from "../../components/ChatBar/ChatBar";
import MessageFC from "../../components/Message/Message";
import MessageInput from "../../components/MessageInput/MessageInput";
import { useAuth } from "../../context/AuthProvider";
import { database, storage } from "../../firebase/config";
import { Chat, Conversation, Message } from "../../util/lib";
import styles from "./Chat.module.css";

interface Props extends RouteComponentProps {
    match: {
        params: { [index: string]: string };
        isExact: boolean;
        path: string;
        url: string;
    }
};

function ChatFC(props: Props) {

    const { currentUser } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [messages, setMessages] = React.useState<{ [timestamp: string]: Conversation }>({});
    const [otherUser, setOtherUser] = React.useState<{
        name: string;
        image: string;
        uid: string;
    }>({
        name: 'unknown',
        image: 'https://lh3.googleusercontent.com/a-/AOh14Gif1-AJzHpwRWmDMwTNUt9Wf6RmnUUw4yqKVP1Ciu0=s96-c',
        uid: ''
    });
    let touid = "";
    const hash = props.match.params["id"];
    if (!hash) {
        props.history.push("/chats");
    }
    if (hash.length === 0) {
        props.history.push("/chats");
    }
    //let schedule: ([(message: Conversation) => void, Conversation])[] = [];
    let schedule: Conversation[] = [];

    let previousSize = 0;
    let scheduler = setInterval(() => {
        let currentSize = schedule.length;
        if (currentSize > 0) {
            setLoading(true);
            console.log(schedule);
            console.log(currentSize, previousSize);
            let newmessages = messages;
            let conv = schedule.shift();
            let a = document.createElement("a");
            while (conv) {
                newmessages[conv.timestamp] = conv;
                a.href = `${props.match.url}#${conv?.timestamp}`;
                conv = schedule.shift();
            }
            console.log(newmessages);
            setMessages(newmessages);
            previousSize = schedule.length;
            a.click();
            setLoading(false);
        } else {
            return;
        }
    }, 1000);

    async function chatExists(hash: string) {
        let snap = await database.ref(`/chats/${hash}`).once("value");
        return snap.exists();
    }
    async function getMyName() {
        let name = 'unknown user';
        if (currentUser && currentUser.displayName) {
            name = currentUser.displayName;
        } else if (currentUser) {
            let snap = await database.ref(`/users/${currentUser?.uid}/name`).once('value');
            if (snap.exists()) {
                name = snap.val();
            }
        }
        return name;
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
        let image = otherUser.image;
        let snap = await database.ref(`/users/${uid}/image`).once('value');
        if (snap.exists()) {
            image = snap.val();
        }
        return image;
    }
    async function createChat(hash: string) {
        if (!currentUser) return;
        let chat: Chat = {
            user1: currentUser.uid,
            user2: touid,
            conversations: {}
        };
        let stamp = Date.now();
        chat.conversations[`${stamp}`] = {
            from: 'system',
            to: chat.user2,
            timestamp: `${stamp}`,
            message: {
                text: `${await getMyName()} started a conversation with ${await getTheirName(chat.user2)}`
            }
        };
        let data: any = {};
        data[hash] = chat;
        database.ref(`/users/${chat.user1}/conversations`).push(hash);
        database.ref(`/users/${chat.user2}/conversations`).push(hash);
        return await database.ref(`/chats`).update(data);
    }
    function subscribeToChat(hash: string) {
        database.ref(`/chats/${hash}/conversations`).on("child_added", async (snap) => {
            //setLoading(true);
            let data: Conversation = snap.val();
            //console.log(data);
            schedule.push(data);
            //onNewMessage(data);
            //setLoading(false);
        });
    }
    function unsubscribeFromChat(hash: string) {
        clearTimeout(scheduler);
        database.ref(`/chats/${hash}/conversations`).off("child_added", (snap) => {
            //console.log(snap.val());
            console.log('unsubscribed');
        });
        //console.log('unsubs');
    }
    async function initialise() {
        setLoading(true);
        if (currentUser)
            touid = props.match.params['id'].replace(currentUser.uid, "").replace(":", "");
        console.log(touid);
        console.log(currentUser?.uid);
        if (await chatExists(hash)) { }
        else {
            createChat(hash);
        }
        let otherUser = {
            name: await getTheirName(touid),
            image: await getTheirImage(touid),
            uid: touid
        };
        setOtherUser(otherUser);
        subscribeToChat(hash);
        setLoading(false);
    }

    React.useEffect(() => {
        initialise();
        return () => {
            unsubscribeFromChat(hash);
        }
    }, []);

    async function sendMessage(message: Message) {
        let timestamp = `${Date.now()}`;
        if (!currentUser) return;
        let data: { [timestamp: string]: Conversation } = {};
        data[timestamp] = {
            message: message,
            timestamp: timestamp,
            to: otherUser.uid,
            from: currentUser.uid
        };
        await database.ref(`chats/${hash}/conversations`).update(data);
    }

    return (
        <IonPage className={styles.page}>
            {loading ? <div className="sdiv">
                <div className="spinner"></div>
            </div> : null}
            <ChatBar messageCount={Object.keys(messages).length} title={otherUser.name} image={otherUser.image} />
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
                <div className="chat">
                    <div className="chat-history">
                        {Object.keys(messages).map(v => <MessageFC key={v} status={messages[v].from === currentUser?.uid ? "SENT" : "RECIEVED"} {...messages[v]} />)}
                    </div>
                </div>
            </IonContent>
            <MessageInput onSend={sendMessage} />
        </IonPage>
    );
}

export default ChatFC;