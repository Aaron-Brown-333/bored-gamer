import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Group } from '../Types/FrameworkTypes';

const GameURLWatcher = ({ groupData, playerId }: { groupData: Group, playerId: string }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!playerId) { return; }
        if (window.location.pathname !== (`/${groupData.gameURL}/${groupData.groupCode}`)) {
            navigate(`/${groupData.gameURL}/${groupData.groupCode}`);
        }
        return
    }, [groupData.gameURL, playerId, navigate, groupData.groupCode]);

    return null;
}

export default GameURLWatcher;