import { IonButton, IonContent, IonImg, IonInput, IonPage } from "@ionic/react";
import { Alert } from 'antd';
import React from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../context/AuthProvider";
import { database } from "../../firebase/config";
import styles from "./Login.module.css";

interface Props extends RouteComponentProps { }

function LoginFC(props: Props) {
    const { login, googleSignIn, currentUser } = useAuth();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const emailRef = React.createRef<HTMLIonInputElement>();
    const passwordRef = React.createRef<HTMLIonInputElement>();

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

    async function loginEP() {
        if (loading || !emailRef.current || !passwordRef.current) return;
        setLoading(true);
        setError(null);
        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        if (email && password) {
            try {
                let loggedIn = await login(`${email}`, `${password}`);
                console.log(loggedIn);
                props.history.push("/home");
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
                {loading ? <div className="sdiv">
                    <div className="spinner"></div>
                </div> : null}
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
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Email
                    </span>
                    <IonInput ref={emailRef} placeholder="Enter your email" type="email" className={styles.input} />
                </div>
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Password
                    </span>
                    <IonInput ref={passwordRef} placeholder="Enter password" type="password" className={styles.input} />
                </div>
                <div className={styles.fpdiv}>
                    <a href="/forgot-password"><span className={styles.fp}>Forgot Password?</span></a>
                </div>
                <div className={styles.lbdiv}>
                    <IonButton onClick={loginEP} disabled={loading} className={styles.lbutton}>Login</IonButton>
                </div>
                <div className={styles.center}>
                    <IonButton disabled={true} onClick={loginGP} className={styles.cont}>
                        <IonImg className={styles.sg} src="https://i.pinimg.com/originals/84/ac/b7/84acb759da6992bbff0e48a60e3a2482.gif" />
                    </IonButton>
                </div>
                <div className={styles.center}>
                    <span className={styles.siw}>Don't have an account?</span>
                    <a href="/signup"><span className={styles.su}> Sign Up</span></a>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default LoginFC;