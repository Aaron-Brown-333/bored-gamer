import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoFormatGroupCode from "../Components/AutoFormatGroupCode";
import { auth } from "../utils/Firebase";
import styles from './Index.module.scss';

import { get, set, ref } from 'firebase/database';
import { realtimeDB } from '../utils/Firebase';
import { Group, Player } from "../Types/FrameworkTypes";

const Index = () => {
    const navigate = useNavigate();
    const [groupCode, setGroupCode] = useState('');

    useEffect(() => {
        const groupCode = localStorage.getItem('groupCode');
        console.log(groupCode);
        if (groupCode) {
            navigate(`/Lobby/${groupCode}`);
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

    // const currentUser = auth.currentUser;
    // if (currentUser) {
    //   console.log(currentUser);

    // }

    const groupExists = async (groupCode: string) => {
        // Logic to check if a group exists
        // using firebase check if a record exists in the database
        const groupRef = ref(realtimeDB, 'groups/' + groupCode);
        const snapshot = await get(groupRef);
        return snapshot.exists();
    };

    const handleJoinGroup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Navigate to the group page
        navigate(`/group/${groupCode}`);
    };

    const handleCreateGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        let groupCode = generateGroupCode();
        while (await groupExists(groupCode)) {
            groupCode = generateGroupCode();
        }

        const playerId = auth.currentUser?.uid || '';
        const adminPlayer: Player = {
            playerId,
            displayName: '',
            photoURL: null,
            avatarURL: null,
        }

        const group: Group = {
            selectedGame: null,
            groupCode,
            groupAdminPlayerId: playerId,
            players: [adminPlayer],
            gameURL: 'Lobby',
        };
        localStorage.setItem('groupCode', groupCode);
        set(ref(realtimeDB, `groups/${groupCode}`), group).catch((err) => console.error(err));
        navigate(`/Lobby/${groupCode}`);
    };

    const handleGroupCodeChange = (value: string) => {
        setGroupCode(value.substring(0, 7));
    };

    groupExists('ABC-123');

    return (
        <div className={styles.landingPage}>
            <button onClick={handleSignOut}>
                Sign Out
            </button>
            <div>
                Index
            </div>
            <div className={styles.container}>
                <div className={styles.welcomeCard}>
                    <h1>Welcome to Bored Gamer!</h1>
                    <p>Get started by either creating a new group or joining an existing one.</p>
                </div>

                <div className={styles.actionCards}>
                    <div className={styles.createCard}>
                        <div className={styles.createGroup}>
                            <p>Start a new group</p>
                            <button
                                className={styles.createButton}
                                onClick={handleCreateGroup}
                                aria-label="Create Group"
                            >⚄</button>
                        </div>
                    </div>

                    <div className={styles.joinCard}>
                        <h2>Join a Group</h2>
                        <p>If you have a group code, enter it below to join the fun!</p>
                        <AutoFormatGroupCode
                            value={groupCode}
                            onValueChange={handleGroupCodeChange}
                        />
                    </div>

                </div>
            </div>
        </div>
    )
};

export default Index;
