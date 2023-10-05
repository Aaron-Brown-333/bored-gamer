export interface ChatMessage {
    message: string,
    senderName: string,
    senderPhoto: string,
    id: string,
    senderId: string,
    timestamp: number,
    messageType: 'player' | 'system',
}

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
    players: Player[] | null;
    chat: ChatMessage[];
    gameURL: string;
} 