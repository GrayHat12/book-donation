import { IonButton, IonContent, IonImg, IonInput, IonPage } from "@ionic/react";
import { Alert } from 'antd';
import React from "react";
import { RouteComponentProps } from "react-router";
import { useAuth } from "../../context/AuthProvider";
import { database } from "../../firebase/config";
import styles from "./Signup.module.css";

interface Props extends RouteComponentProps { }

function SignupFC(props: Props) {
    const { signup, googleSignIn, currentUser } = useAuth();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const emailRef = React.createRef<HTMLIonInputElement>();
    const passwordRef = React.createRef<HTMLIonInputElement>();
    const nameRef = React.createRef<HTMLIonInputElement>();
    const addressRef = React.createRef<HTMLIonInputElement>();


    function afterNewUser(cred: firebase.default.auth.UserCredential,user:any) {
        console.log(user);
        let userdata = {
            name: `${user.name}`,
            phoneNumber: cred.user?.providerData[0]?.phoneNumber,
            image: cred.user?.providerData[0]?.photoURL,
            address: `${user.address}`,
            displayName: cred.user?.providerData[0]?.displayName,
            email: cred.user?.email
        };
        currentUser?.updateProfile({
            displayName: cred.user?.providerData[0]?.displayName || userdata.name || cred.user?.uid || "user",
            photoURL: cred.user?.providerData[0]?.photoURL || "https://static.thenounproject.com/png/630740-200.png"
        });
        console.log(userdata);
        return database.ref(`users/${cred.user?.uid}`).update(userdata);
    }

    async function signupEP() {
        if (loading || !emailRef.current || !passwordRef.current || !nameRef.current || !addressRef.current) return console.log("returned");
        let email = emailRef.current.value;
        let password = passwordRef.current.value;
        let name = nameRef.current.value;
        let address = addressRef.current.value;
        setLoading(true);
        setError(null);
        if (email && password) {
            try {
                let loggedIn = await signup(`${email}`, `${password}`);
                console.log(loggedIn);
                if (loggedIn) {
                    if (loggedIn.additionalUserInfo?.isNewUser) {
                        await afterNewUser(loggedIn, {
                            name, address
                        });
                    }
                }
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

    async function signupGP() {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            let loggedIn = await googleSignIn();
            console.log(loggedIn);
            if (loggedIn) {
                if (loggedIn.additionalUserInfo?.isNewUser) {
                    await afterNewUser(loggedIn,{
                        name: loggedIn.user?.displayName,
                        address: 'none'
                    });
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
                    <span className={styles.title}>Sign Up</span>
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
                        Full Name
                    </span>
                    <IonInput ref={nameRef} placeholder="Enter your name" type="text" className={styles.input} />
                </div>
                <div className={styles.inpitemdiv}>
                    <span className={styles.inplab}>
                        Address
                    </span>
                    <IonInput ref={addressRef} placeholder="Enter Address" type="text" className={styles.input} />
                </div>
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
                <div className={styles.lbdiv}>
                    <IonButton onClick={signupEP} disabled={loading} className={styles.lbutton}>Sign Up</IonButton>
                </div>
                <div className={styles.center}>
                    <IonButton disabled={true} onClick={signupGP} className={styles.cont}>
                        <IonImg className={styles.sg} src="https://i2.wp.com/media.giphy.com/media/9UZZkQDcquUVfCjTg3/giphy.gif" />
                    </IonButton>
                </div>
                <div className={styles.center}>
                    <span className={styles.siw}>Already have an account?</span>
                    <a href="/login"><span className={styles.su}> Sign In</span></a>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default SignupFC;