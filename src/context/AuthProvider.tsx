import firebase from "firebase";
import React, { useContext } from "react";
import { auth } from "../firebase/config";

const AuthContext = React.createContext<{
    currentUser: firebase.User | null;
    login: (email: string, password: string) => Promise<firebase.auth.UserCredential> | void;
    signup: (email: string, password: string) => Promise<firebase.auth.UserCredential> | void;
    logout: () => Promise<any> | void;
    resetPassword: (email: string) => Promise<any> | void;
    updatePassword: (newPassword: string) => Promise<any> | void;
    googleSignIn: () => Promise<firebase.auth.UserCredential> | void;
    sendPasswordResetEmail: (email:string) => Promise<void> | void;
}>({
    currentUser: null,
    login: (email: string, password: string) => console.log(email, password),
    signup: (email: string, password: string) => console.log(email, password),
    logout: () => console.log(),
    resetPassword: (email: string) => console.log(email),
    updatePassword: (newPassword: string) => console.log(newPassword),
    googleSignIn: () => console.log("Unimplemented"),
    sendPasswordResetEmail: (email:string) => console.log(email),
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {

    const [currentUser, setCurrentUser] = React.useState<null | firebase.User>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    function login(email: string, password: string) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        return auth.signOut();
    }

    function updatePassword(newPassword: string) {
        return currentUser?.updatePassword(newPassword);
    }

    async function googleSignIn() {
        let provider = new firebase.auth.GoogleAuthProvider();
        return auth.signInWithPopup(provider);
        //return auth.signInWithRedirect(provider);
    }

    function sendPasswordResetEmail(email: string) {
        return auth.sendPasswordResetEmail(email);
    }

    function signup(email: string, password: string) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function resetPassword(email: string) {
        return auth.sendPasswordResetEmail(email);
    }

    React.useEffect(() => {
        const unsubcscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubcscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        resetPassword,
        updatePassword,
        googleSignIn,
        signup,
        sendPasswordResetEmail
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}