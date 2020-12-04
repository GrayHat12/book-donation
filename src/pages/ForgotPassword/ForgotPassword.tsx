import { IonButton, IonContent, IonImg, IonInput, IonPage } from "@ionic/react";
import { Alert } from 'antd';
import React from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../context/AuthProvider";
import { database } from "../../firebase/config";
import styles from "./FP.module.css";

interface Props extends RouteComponentProps { }

function ForgotPasswordFC(props: Props) {
    const { sendPasswordResetEmail, googleSignIn, currentUser } = useAuth();
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const emailRef = React.createRef<HTMLIonInputElement>();

    function afterNewUser(cred: firebase.default.auth.UserCredential) {
        let userdata = {
            name: cred.user?.providerData[0]?.displayName,
            phoneNumber: cred.user?.providerData[0]?.phoneNumber,
            image: cred.user?.providerData[0]?.photoURL,
            address: '',
            displayName: cred.user?.providerData[0]?.displayName,
            email: cred.user?.email
        };
        currentUser?.updateProfile({
            displayName: cred.user?.providerData[0]?.displayName || userdata.name || `${cred.user?.uid}` || "user",
            photoURL: cred.user?.providerData[0]?.photoURL || "https://static.thenounproject.com/png/630740-200.png"
        });
        return database.ref(`users/${cred.user?.uid}`).update(userdata);
    }

    async function resetPasswordEP() {
        if (loading || !emailRef.current) return;
        setLoading(true);
        setError(null);
        let email = emailRef.current.value;
        if (email) {
            try {
                let loggedIn = await sendPasswordResetEmail(`${email}`);
                console.log(loggedIn);
                setMessage("Check your mailbox");
            }
            catch (err) {
                console.error(err);
                setError(err.message);
            }
        } else {
            setError("Fill all fields");
        }
        setLoading(false);
    }
    async function loginGP() {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            let loggedIn = await googleSignIn();
            console.log(loggedIn);
            if (loggedIn) {
                if (loggedIn.additionalUserInfo?.isNewUser) {
                    await afterNewUser(loggedIn);
                }
            }
            props.history.push("/home");
        }
        catch (err) {
            console.error(err);
            setError(err.message);
        }
        setLoading(false);
    }

    return (
        <IonPage className={styles.page}>
            <IonContent className={styles.page}>
                <div className={styles.titlediv}>
                    <span className={styles.title}>Login</span>
                </div>
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
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Email
                    </span>
                    <IonInput ref={emailRef} placeholder="Enter your email" type="email" className={styles.input} />
                </div>
                <div className={styles.fpdiv}>
                    <a href="/login"><span className={styles.fp}>Login</span></a>
                </div>
                <div className={styles.lbdiv}>
                    <IonButton onClick={resetPasswordEP} disabled={loading} className={styles.lbutton}>Reset Password</IonButton>
                </div>
                <div className={styles.center}>
                    <span className={styles.siw}>Don't have an account?</span>
                    <a href="/signup"><span className={styles.su}> Sign Up</span></a>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default ForgotPasswordFC;