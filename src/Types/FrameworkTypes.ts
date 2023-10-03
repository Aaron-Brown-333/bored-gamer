export interface Player {
    playerId: string;
    displayName: string;
    photoURL: string | null;
    avatarURL: string | null;
}

export interface Group {
    selectedGame: string | null;
    groupCode: string;
    groupAdminPlayerId: string;
    players: Player[];
    gameURL: string;
} 