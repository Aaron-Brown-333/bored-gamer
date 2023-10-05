import useGroupData from '../Hooks/useGroupData';
import { Player } from '../Types/FrameworkTypes';
import styles from './PlayerList.module.scss';

const PlayerList = () => {
    const [groupData, updateGroupData] = useGroupData();
    debugger;
    if (!groupData) return <div>Loading...</div>;
    if (!groupData.players) return <div>No players</div>;

    return (
        <div className='card'>
            <div className='header'>Player List</div>
            {Object.values(groupData.players).map(({ playerId, photoURL, displayName }: Player) => (
                <div key={playerId} className={styles.playerRow}>
                    <img className='avatar' src={photoURL || '/emptyAvatar.png'} alt='player avatar' />
                    <p className={styles.playerName}>{displayName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                </div>
            ))}
        </div>
    );
};

export default PlayerList;
