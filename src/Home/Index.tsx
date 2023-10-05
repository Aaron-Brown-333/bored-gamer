import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoFormatGroupCode from "../Components/AutoFormatGroupCode";
import { auth } from "../utils/Firebase";
import styles from './Index.module.scss';

import { get, set, ref } from 'firebase/database';
import { realtimeDB } from '../utils/Firebase';
import { Group, Player } from "../Types/FrameworkTypes";

import { ToastContainer, toast } from 'react-toastify';
import * as GroupUtils from "../utils/GroupUtils";
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {
    const navigate = useNavigate();
    const [groupCode, setGroupCode] = useState('');

    useEffect(() => {
        const savedGroupCode = localStorage.getItem('groupCode');
        if (savedGroupCode) {
            navigate(`/Lobby/${savedGroupCode}`);
        }
    }, [navigate]);

    const generateGroupCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        result += '-';
        for (let i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const createCurrentPlayer = () => {
        const currentPlayer: Player = {
            playerId:  auth.currentUser?.uid || '',
            displayName: auth.currentUser?.displayName || '',
            photoURL: auth.currentUser?.photoURL || '',
            avatarURL: null,
        }
        return currentPlayer;
    }

    const groupExists = async (groupCode: string) => {
        // Logic to check if a group exists
        // using firebase check if a record exists in the database
        const groupRef = ref(realtimeDB, 'groups/' + groupCode);
        const snapshot = await get(groupRef);
        console.log(snapshot.exists());
        return snapshot.exists();
    };

    const gotoGroupLobby = async (groupCode: string) => {   
        localStorage.setItem('groupCode', groupCode);
        GroupUtils.AddPlayerToGroup(groupCode, createCurrentPlayer());
        navigate(`/Lobby/${groupCode}`);
    }

    const handleJoinGroup = async () => {
        // check if group exists
        if (!groupCode) { 
            console.log('no group code');
            toast.error('Please enter a group code', { autoClose: 1000});
            return;
        }

        if(! await groupExists(groupCode)) {
            console.log('group does not exist'  + groupCode);
            toast.error('Group does not exist', { autoClose: 1000});
            return;
        }
        gotoGroupLobby(groupCode);

    }; 

    const handleCreateGroup = async (e: React.MouseEvent) => {
        e.preventDefault();

        let groupCode = generateGroupCode();
        while (await groupExists(groupCode)) {
            groupCode = generateGroupCode();
        }

        const playerId = auth.currentUser?.uid || '';
        const group: Group = {
            selectedGame: null,
            groupCode,
            groupAdminPlayerId: playerId,
            players: null,
            gameURL: 'Lobby',
            chat: [],
        };
        set(ref(realtimeDB, `groups/${groupCode}`), group).catch((err) => console.error(err));
        gotoGroupLobby(groupCode);

    };

    const handleGroupCodeChange = (value: string) => {
        setGroupCode(value.substring(0, 7));
    };

    return (
        <div className={styles.landingPage}>
            <ToastContainer />
            <div className={styles.container}>
                <div className={styles.welcomeCard + ' card'}>
                    <h1>Welcome to Bored Gamer!</h1>
                    <p>Get started by either creating a new group or joining an existing one.</p>
                </div>

                <div className={styles.actionCards}>
                    <div className={styles.createCard + ' card'}>
                        <div className={styles.createGroup}>
                            <h2>Create a new group</h2>
                            <button
                                className="pulse-button"
                                onClick={handleCreateGroup}
                                aria-label="Create Group"
                            >⚄</button>
                        </div>
                    </div>

                    <div className={styles.joinCard + ' card'}>
                        <h2>Join a Group</h2>
                        <p>If you have a group code, enter it below to join the fun!</p>
                        <AutoFormatGroupCode
                            value={groupCode}
                            onValueChange={handleGroupCodeChange}
                        />
                        <button onClick={handleJoinGroup} className="actionButton">Join Group</button>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Index;
