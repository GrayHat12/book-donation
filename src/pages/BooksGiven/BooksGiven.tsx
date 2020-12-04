import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonInput, IonPage } from "@ionic/react";
import { Alert } from "antd";
import React from "react";
import AppBar from "../../components/AppBar/AppBar";
import BottomBarFC from "../../components/BottomBar/BottomBar";
import PostFC from "../../components/Post/Post";
import { useAuth } from "../../context/AuthProvider";
import { database, storage } from "../../firebase/config";
import { Post } from "../../util/lib";
import styles from "./BG.module.css";

interface Props { };

function BooksGivenFC() {

    const { currentUser } = useAuth();
    const [photoUrl, setPhotoUrl] = React.useState('https://www.ultimatesource.toys/wp-content/uploads/2013/11/dummy-image-landscape-1.jpg');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [posts, setPosts] = React.useState<Post[]>([]);

    const titleRef = React.createRef<HTMLIonInputElement>();
    const phoneRef = React.createRef<HTMLIonInputElement>();
    const bodyRef = React.createRef<HTMLIonInputElement>();
    const booktitRef = React.createRef<HTMLIonInputElement>();
    const bookautRef = React.createRef<HTMLIonInputElement>();
    const booklanRef = React.createRef<HTMLIonInputElement>();
    const booksubRef = React.createRef<HTMLIonInputElement>();

    async function postGiven() {
        if (loading) return;
        if (!titleRef.current || !phoneRef.current || !bodyRef.current || !booktitRef.current || !bookautRef.current || !booklanRef.current || !booksubRef.current) return;
        setLoading(true);
        setError(null);
        setMessage(null);
        let post: Post = {
            title: '' + (titleRef.current.value || ""),
            author: currentUser?.uid || "null",
            phone: '' + phoneRef.current.value,
            body: '' + bodyRef.current.value,
            book: {
                title: '' + booktitRef.current.value,
                author: '' + bookautRef.current.value,
                image: photoUrl,
                language: '' + booklanRef.current.value,
                subTitle: '' + booksubRef.current.value
            }
        };
        try {
            await database.ref('/give').push(post);
            await getGivenPosts();
        }
        catch (err) {
            console.error(err);
            setError(err.message);
        }
        setLoading(false);
    }

    async function getGivenPosts() {
        if (loading) return;
        setLoading(true);
        try {
            let tposts = await database.ref('/give').once('value');
            let val = tposts.val();
            if(val === null) {
                alert("No Posts Found");
                setLoading(false);
                return;
            };
            //let fposts = Object.values<Post>(val).filter((x: Post) => x.author !== currentUser?.uid);
            setPosts(Object.values(val));
        }
        catch (err) {
            console.error(err);
            setError(err);
        }
        setLoading(false);
    }

    async function upload() {
        if (loading) return;
        setLoading(true);
        try {
            let element = document.createElement("input");
            element.setAttribute("type", "file");
            element.onchange = async (ev: any) => {
                console.log(ev.target.files[0]);
                if (ev.target.files[0]) {
                    let file = ev.target.files[0];
                    try {
                        let uploadTask = await storage.ref(`${file.name}`).put(file);
                        let uploaded = await storage.ref(`${file.name}`).getDownloadURL();
                        setPhotoUrl(uploaded);
                        setLoading(false);
                        console.log(uploadTask);
                    } catch (err) {
                        console.error(err);
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            }
            element.click();
        }
        catch (err) {
            console.error(err);
            alert(JSON.parse(err));
        }
        //setLoading(false);
    }

    React.useEffect(() => {
        getGivenPosts();
    }, []);

    return (
        <IonPage className={styles.page}>
            <AppBar title="Donation" />
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
                <IonCard>
                    <IonCardContent>
                        <IonInput ref={titleRef} placeholder="Post Title" type="text"></IonInput>
                        <IonInput ref={phoneRef} placeholder="Phone Number" type="tel"></IonInput>
                        <IonInput ref={bodyRef} placeholder="Post Body" type="text"></IonInput>
                        <IonInput ref={booktitRef} placeholder="Book Title" type="text"></IonInput>
                        <IonInput ref={bookautRef} placeholder="Book Author" type="text"></IonInput>
                        <IonInput ref={booklanRef} placeholder="Book Language" type="text"></IonInput>
                        <IonInput ref={booksubRef} placeholder="Book Subtitle" type="text"></IonInput>
                        <IonButton onClick={postGiven}>POST</IonButton>
                    </IonCardContent>
                </IonCard>
                {posts.map((v, i) => <PostFC {...v} key={i} />)}
            </IonContent>
            <BottomBarFC selected="give" />
        </IonPage>
    );
}

export default BooksGivenFC;