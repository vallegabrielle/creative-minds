import Message from "../components/Message";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from 'react-toastify';
import { Timestamp, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

export default function Details() {

    const router = useRouter();
    const routeData = router.query;
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);

    const submitMessage = async() => {
        if (!auth.currentUser) return router.push('/auth/login');
        if (!message) {
            toast.error("Don't leave an empty message", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500
            });
        }
        
        const docRef = doc(db, 'posts', routeData.id);
        await updateDoc(docRef, {
            comments: arrayUnion({
                message,
                avatar: auth.currentUser.photoURL,
                userName: auth.currentUser.displayName,
                time: Timestamp.now()
            })
        });

        setMessage('');

        return;
    }

    const getComments = async() => {
        const docRef = doc(db, 'posts', routeData.id);
        const unsubscribe = onSnapshot(docRef, snapshot => {
            setAllMessages(snapshot.data().comments)
        });
        
        return unsubscribe;
    }

    useEffect(() => {
        if (!router.isReady) return;
        getComments();
    }, []);

    return (
        <div>
            <Message {...routeData}></Message>
            <div className="my-4">
                <div className="flex gap-4">
                    <input 
                        type="text"
                        value={message}
                        placeholder="Send a message"
                        onChange={e => setMessage(e.target.value)}
                        className="bg-gray-800 w-full p-2 text-white text-sm rounded-lg"
                    />
                    <button
                        className="bg-cyan-500 text-white text-sm py-2 px-4 rounded-lg"
                        onClick={submitMessage}
                    >
                        Submit
                    </button>
                </div>
                <div className="py-6 mt-4">
                    <h2 className="text-pink-500 text-xl">Comments</h2>
                    {allMessages.map(message => {
                        return (
                            <div className="bg-white p-4 my-4 border-2 border-gray-100 rounded-lg" key={message.time}>
                                <div className="flex items-center gap-2 mb-4">
                                    <img 
                                        src={message.avatar}
                                        alt="Profile photo"
                                        className="w-10 rounded-full"
                                    />
                                    <h2>{message.userName}</h2>
                                </div>
                                <h2>{message.message}</h2>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}