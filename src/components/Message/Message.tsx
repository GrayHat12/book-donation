import { } from "@ionic/react";
import React from "react";
import { Conversation } from "../../util/lib";
import styles from "./Message.module.css";

interface Props extends Conversation {
    status: "SENT" | "RECIEVED" | "ONTHEWAY";
};

function MessageFC(props: Props) {
    let date = new Date(parseInt(props.timestamp));
    let hrs = date.getHours() % 12;
    if (hrs === 0) hrs = 12;
    let mins = date.getMinutes();
    let meridian = date.getHours() >= 12 ? "PM" : "AM";
    let day = "Today";
    let today = new Date();
    if (date.getDay() !== today.getDay() || date.getDate() !== today.getDate() || date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
        day = `${date.getDate()}`;
        day = `${day} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]}`;
    }
    if (date.getFullYear() !== today.getFullYear()) {
        day = `${day} ${date.getFullYear()}`;
    }
    if (props.from === "system")
        return (
            <section id={props.timestamp} className={styles.clearfix}>
                <div className={styles.system}>
                    <svg width="10" height="12" viewBox="0 0 10 12" xmlns="http://www.w3.org/2000/svg"><path d="M5.008 1.6c1.375 0 2.501 1.074 2.586 2.427l.005.164v1.271h.158c.585 0 1.059.48 1.059 1.07v3.351c0 .59-.474 1.07-1.059 1.07h-5.5c-.582 0-1.057-.48-1.057-1.07V6.531c0-.59.474-1.069 1.058-1.069h.158V4.191c0-1.375 1.075-2.501 2.429-2.586l.163-.005zm0 1.248c-.696 0-1.272.534-1.337 1.214l-.006.129-.002 1.271H6.35l.001-1.271c0-.653-.47-1.2-1.088-1.319l-.126-.018-.129-.006z" fill="currentColor"></path></svg>
                    {" "}{props.message.text}
                </div>
            </section>
        );
    if (props.status === "SENT" || props.status === "ONTHEWAY")
        return (
            <section id={props.timestamp} className="clearfix">
                <div className="message-data align-right">
                    <span className="message-data-time">{hrs}:{mins} {meridian}, {day}</span> &nbsp; &nbsp;
                    <span className="message-data-name">Sent</span> <i className="fa fa-circle me"></i>
                </div>
                <div className="message other-message float-right">
                    {props.message.text}
                </div>
            </section>
        );
    else
        return (
            <section id={props.timestamp}>
                <div className="message-data">
                    <span className="message-data-name"><i className="fa fa-circle online"></i> Rec</span>
                    <span className="message-data-time">{hrs}:{mins} {meridian}, {day}</span>
                </div>
                <div className="message my-message">
                    {props.message.text}
                </div>
            </section>
        );
}

export default MessageFC;