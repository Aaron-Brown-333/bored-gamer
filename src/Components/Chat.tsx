import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ref, push, onValue, off } from 'firebase/database';
import { realtimeDB } from '../utils/Firebase';
import styles from './Chat.module.scss';

import { ChatMessage } from '../Types/FrameworkTypes';

interface BatchedMessage {
    senderId: string;
    senderName: string;
    senderPhoto: string;
    messages: string[];
}


const Chat = ({ playerName, playerPhotoURL, playerId }: { playerName: string, playerPhotoURL: string | null, playerId: string }) => {
    const messagesEndRef = useRef<HTMLSpanElement>(null);
    const { GroupCode } = useParams<string>();
    const [chatMessages, setChatMessages] = useState<any>();
    const [formValue, setFormValue] = useState('');
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const isAtBottomRef = useRef<boolean>(true);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const atBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
        isAtBottomRef.current = atBottom;
        if (atBottom) { setShowScrollToBottom(false); }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNewMessage = () => {
        if (isAtBottomRef.current) {
            scrollToBottom();
        } else {
            setShowScrollToBottom(true);
        }
    };

    const handleScrollToBottomClick = () => {
        scrollToBottom();
        setShowScrollToBottom(false);
    };

    useEffect(() => {
        if (!GroupCode) { return; }

        const groupDataRef = ref(realtimeDB, `groups/${GroupCode}/chatMessages`);
        const handleNewMessageArrival = (snapshot: any) => {
            setChatMessages(snapshot.val());
            handleNewMessage();
        };
        onValue(groupDataRef, handleNewMessageArrival);

        return () => off(groupDataRef);
    }, [GroupCode]);


    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        await push(ref(realtimeDB, `groups/${GroupCode}/chatMessages`),
            {
                message: formValue,
                senderName: playerName,
                senderPhoto: playerPhotoURL,
                timestamp: Date.now(),
                senderId: playerId,
            }
        ).catch((err) => console.error(err));

        setFormValue('');

        // Use setTimeout to delay the scroll check until after the form submission has been processed
        setTimeout(() => {
            if (isAtBottomRef.current) {
                scrollToBottom();
            }
        }, 0);
    }

    const batchMessages = (messages: { [key: string]: ChatMessage }) => {
        const batched: BatchedMessage[] = [];
        let currentBatch: BatchedMessage | null = null;

        const messagesArray = Object.values(messages).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

        messagesArray.forEach((message) => {
            if (currentBatch && message.senderId === currentBatch.senderId) {
                currentBatch.messages.push(message.message);
            } else {
                currentBatch = {
                    senderId: message.senderId,
                    senderName: message.senderName,
                    senderPhoto: message.senderPhoto,
                    messages: [message.message],
                };
                batched.push(currentBatch);
            }
        });

        return batched;
    };

    return (
        <>
            <main className={`${styles.chatter} card`}>
                <div className='header'>Chatter</div>
                <div className={styles.messagesContainer}>
                    <div className={styles.messages} onScroll={handleScroll}>
                        {chatMessages && batchMessages(chatMessages).map((batch, index) => (
                            <Message key={index} batch={batch} playerId={playerId} />
                        ))}
                        <span ref={messagesEndRef}></span>
                    </div>
                    {showScrollToBottom && (
                        <div className={styles.scrollToBottom} onClick={handleScrollToBottomClick}>
                            View Latest ⬇️
                        </div>
                    )}
                </div>

                <form onSubmit={sendMessage}>
                    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                    <button type="submit" disabled={!formValue} aria-label="Send Message">{formValue ? '➡️' : '🟦'}</button>
                </form>
            </main>
        </>
    );
};

function Message({ batch, playerId }: { batch: BatchedMessage, playerId: string }) {
    const { messages, senderPhoto, senderId } = batch;

    const messageClass = playerId === senderId ? styles.sent : styles.received;

    return (
        <div className={`${styles.message} ${messageClass}`}>
            <img alt='player avatar' src={senderPhoto || '/emptyAvatar.png'} />
            <section>
                {messages.map((msg, index) => <p key={index}>{msg}</p>)}
            </section>
        </div>
    );
}

export default Chat;
