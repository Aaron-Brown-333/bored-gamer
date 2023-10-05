import { Player } from "../Types/FrameworkTypes";
import { realtimeDB } from "./Firebase";
import { get, set, ref } from 'firebase/database';

export const GetUserById = async (id: string) => {
    const userRef = ref(realtimeDB, 'users/' + id);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

export const SaveUser = async (id: string, user: any) => {
    await set(ref(realtimeDB, 'users/' + id), user);
}

export const GetGroupById = async (id: string) => {
    const groupRef = ref(realtimeDB, 'groups/' + id);
    const snapshot = await get(groupRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        return null;
    }
}

export const RemovePlayerFromGroup = async (id: string, playerId: string) => {
    const playerRef = ref(realtimeDB, 'groups/' + id + '/players/' + playerId);
    await set(playerRef, null);
}

export const AddPlayerToGroup3 = async (id: string, player: Player) => {
    const playerRef = ref(realtimeDB, 'groups/' + id + '/players/' + player.playerId);
    await set(playerRef, player);
}


export const AddPlayerToGroup = async (groupId: string, player: Player) => {
    const playerRef = ref(realtimeDB, 'groups/' + groupId + '/players/' + player.playerId);
    
    // Look for a matching player profile record
    const profileRef = ref(realtimeDB, 'playerProfiles/' + player.playerId);
    const profileSnapshot = await get(profileRef);
    
    // If profile exists, override display name and avatarURL on the player
    if (profileSnapshot.exists()) {
        const profile = profileSnapshot.val();
        player.displayName = profile.displayName || player.displayName;
        player.avatarURL = profile.avatarURL || player.avatarURL;
        // ...any other fields to override
    } else {
        await set(profileRef, {
            displayName: player.displayName,
            avatarURL: player.avatarURL,
        });
    }    
    // Add/Update the player in the group
    await set(playerRef, player);
}