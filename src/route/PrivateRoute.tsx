import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function PrivateRoute({ component: Component, ...rest }: { [x: string]: any; component: any; }) {
    const { currentUser } = useAuth();
    return <Route {...rest}
        render={props => {
            return currentUser ? <Component {...props} /> : <Redirect to="/login" />
        }}
    />
}