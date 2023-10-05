import { useState, useEffect } from 'react';
import { ref, onValue, off, set } from 'firebase/database';
import { realtimeDB } from '../utils/Firebase';
import { Group } from '../Types/FrameworkTypes';

function useGroupData() {
  const [groupData, setGroupData] = useState<Group | null>(null);
  const groupCode = localStorage.getItem('groupCode');

  useEffect(() => {
    debugger;
    const groupDataRef = ref(realtimeDB, `groups/${groupCode}`);
    onValue(groupDataRef, (snapshot) => { setGroupData(snapshot.val()); });
    return () => off(groupDataRef);
  }, [groupCode]);

  const updateGroupData = async (newGroupData: Group) => {
    try {
      await set(ref(realtimeDB, `groups/${groupCode}`), newGroupData);
      setGroupData(newGroupData); // Update local state
    } catch (error) {
      console.error("Error updating group data:", error);
    }
  };

  return [groupData, updateGroupData] as const;
}

export default useGroupData;
