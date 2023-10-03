import React, { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../utils/Firebase'; // Adjust path as needed
import styles from './AuthenticatedLayout.module.scss';

const AuthenticatedLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const location = useLocation();
    const user = auth.currentUser;

    const handleLogout = () => {
        auth.signOut();
    };

    const leaveRoom = (
        <Link to="/lobby" className={styles.link}>
            Leave Room
        </Link>
    );

    return (
        <>
            <section className={styles['top-nav']}>
                <div>
                    Logo Here
                </div>
                <input id="menu-toggle" className={styles.menuToggle} type="checkbox" />
                <label className={styles['menu-button-container']} htmlFor="menu-toggle">
                    <div className={styles['menu-button']}></div>
                </label>
                <ul className={styles.menu}>
                    <li>{leaveRoom}</li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                    <li>Three</li>
                    <li>Four</li>
                    <li>
                        {user && (
                            <div className={styles.userInfo}>
                                <img src={user.photoURL || ''} alt="avatar" className={styles.avatar} />
                                {/* <span className={styles.username}>{user.displayName}</span> */}
                            </div>
                        )}
                    </li>
                </ul>

            </section>
            <main>
                {children}
            </main>
        </>
    );
};

export default AuthenticatedLayout;
