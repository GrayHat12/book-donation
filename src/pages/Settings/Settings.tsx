import { IonButton, IonContent, IonInput, IonPage } from "@ionic/react";
import { Alert } from "antd";
import React from "react";
import AppBar from "../../components/AppBar/AppBar";
import BottomBarFC from "../../components/BottomBar/BottomBar";
import { useAuth } from "../../context/AuthProvider";
import { database, storage } from "../../firebase/config";
import styles from "./Settings.module.css";

interface Props { };

function SettingsFC(props: Props) {
    const { currentUser } = useAuth();
    const [photoUrl, setPhotoUrl] = React.useState((currentUser && currentUser.photoURL) ? currentUser.photoURL : 'https://lh3.googleusercontent.com/a-/AOh14Gif1-AJzHpwRWmDMwTNUt9Wf6RmnUUw4yqKVP1Ciu0=s96-c');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);

    const displayNameRef = React.createRef<HTMLIonInputElement>();
    const addressRef = React.createRef<HTMLIonInputElement>();
    const phoneNumberRef = React.createRef<HTMLIonInputElement>();

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
                        currentUser?.updateProfile({
                            photoURL: uploaded
                        });
                        database.ref(`users/${currentUser?.uid}`).update({
                            image: photoUrl
                        });
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

    async function update() {
        if (loading) return;
        if (!displayNameRef.current || !addressRef.current || !phoneNumberRef.current) return;
        setLoading(true);
        let name = `${displayNameRef.current.value}`;
        let phone = `${phoneNumberRef.current.value}`;
        let address = `${addressRef.current.value}`;
        currentUser?.updateProfile({
            displayName: name
        });
        try {
            await database.ref(`users/${currentUser?.uid}`).update({
                displayName: name,
                address: address,
                phone: phone
            });
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
        setLoading(false);
    }

    return (
        <IonPage className={styles.page}>
            {loading ? <div className="sdiv">
                <div className="spinner"></div>
            </div> : null}
            <AppBar title="Settings"></AppBar>
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
                <div className={styles.center}>
                    <img onClick={upload} src={photoUrl} alt="profile" className={styles.avatar} />
                </div>
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Display Name
                    </span>
                    <IonInput ref={displayNameRef} placeholder="Username" defaultValue={currentUser && currentUser.displayName ? currentUser.displayName : ""} type="text" className={styles.input} />
                </div>
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Address
                    </span>
                    <IonInput ref={addressRef} placeholder="Address" type="text" className={styles.input} />
                </div>
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Phone Number
                    </span>
                    <IonInput ref={phoneNumberRef} placeholder="Contact Number" type="tel" className={styles.input} />
                </div>
                <div className={styles.lbdiv}>
                    <IonButton onClick={update} disabled={loading} className={styles.lbutton}>Update</IonButton>
                </div>
            </IonContent>
            <BottomBarFC selected="settings" />
        </IonPage>
    );
};

export default SettingsFC;