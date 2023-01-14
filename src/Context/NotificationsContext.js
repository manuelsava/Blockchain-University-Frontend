import React, { useState, useEffect, useContext } from "react";
import { createContext } from "react";
import { Store } from 'react-notifications-component';
import {io} from "socket.io-client";
import { BlockchainContext } from "../Context/BlockchainContext";

export const NotificationsContext = React.createContext({});

export const NotificationsProvider = (props) => {
    const {signerAddress} = useContext(BlockchainContext);
    const [socketId, setSocketId] = useState();
    const [refreshProposals, setRefreshProposals] = useState(false);
    const [refreshEnrollment, setRefreshEnrollment] = useState(false);
    const [socket, setSocket] = useState(null);

    const api = process.env.REACT_APP_API;

    useEffect(() => {
        if(socket === null) {
            setSocket(io(api, {
                reconnectionDelay: 1000,
                reconnection: true,
                reconnectionAttemps: 10,
                agent: false,
                upgrade: false,
                rejectUnauthorized: false,
                autoConnect: false
            }));
        }

        if(signerAddress !== undefined && socket !== null){
            socket.open();

            socket.on("connect", () => {
                socket.emit("new-listener", signerAddress);
                setSocketId(socket.id);
                console.log("connected with id: " + socket.id);
            });    

            socket.on("enrollment-received", () => {
                Store.addNotification({
                    title: "New Enrollment",
                    message: "A student submitted a request!",
                    type: "info",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
                setRefreshEnrollment(prevState => !prevState);
            })

            socket.on("proposal-approved", () => {
                Store.addNotification({
                    title: "New approved proposal",
                    message: "A proposal has been approved",
                    type: "info",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
                setRefreshProposals(prevState => !prevState);
            })
        }
    
    }, [signerAddress, socket])

    return (
        <NotificationsContext.Provider value={{
            socketId,
            refreshProposals,
            refreshEnrollment
            }}>
            {props.children}
        </NotificationsContext.Provider>
    )
}