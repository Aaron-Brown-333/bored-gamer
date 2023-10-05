// Lobby.tsx 
import React, { useState} from 'react';
import styles from './Lobby.module.scss';
import Chat from '../Components/Chat';
import { auth } from '../utils/Firebase';
import QRCode from 'react-qr-code';
import PlayerList from '../Components/PlayerList';

const Lobby = () => {
  const groupCode = localStorage.getItem('groupCode');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);


  const user = auth.currentUser;
  if (!user) { return null; }

  return (
    <div className={styles.lobby}>
      <header className={styles.header}>
        Group Code: {groupCode} <button onClick={openDialog} className='actionButton'>Show QR Code</button>
      </header>
      {isDialogOpen && (
        <dialog open className={styles.qrCodeDialog}>
          <h2>Scan QR Code</h2>
          <QRCode value={`https://bored-gamer-6dadc.web.app/${groupCode}`} /><br />
          <button onClick={closeDialog}>Close</button>
        </dialog>
      )}
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <PlayerList />
          <Chat
           playerName={user.displayName || ''}
            playerPhotoURL={user?.photoURL} 
            playerId={user.uid}
            />
        </aside>
        <main className={styles.mainContent}>
          Main content
        </main>
      </div>
    </div>

  );
};

export default Lobby;
