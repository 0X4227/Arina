import { useState } from 'react';
import { readDocument, updateDocument, createDocument } from '@/api/firebase/master/firestoreCrud';
import { arrayUnion } from 'firebase/firestore';
import { useLocalStorage } from 'usehooks-ts';
import { CONTRIBUTION_COLLECTION, GAME_COLLECTION } from '@/constants/collections';
import { useRouter } from 'next/router';

const useAddParticipant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isParticipantAdded, setIsParticipantAdded] = useState(false);
  const [redirectUrl, setRedirectUrl] = useLocalStorage('redirectUrl', null);

  const router = useRouter();
  const [user] = useLocalStorage('user', null);
  const wallet = user?.walletAddress;
  const userId = user?.id;

  const addParticipant = async ({ gameId, teamName, joinAsPlayer, supportPlayerId, amount,transactionHashes }) => {

   
    setLoading(true);
    setError(null);
    const date = Math.floor(new Date().getTime() / 1000);

    try {
      validateInput({ gameId, teamName, amount, joinAsPlayer, supportPlayerId });

      const gameData = await fetchGameData(gameId);

      if (joinAsPlayer) {
        const pl = await addPlayer({ gameData, teamName, gameId, userId, amount, date,transactionHashes });
        if(pl){
            setRedirectUrl(null);
        router.push("/user/");
            setIsParticipantAdded(true);
        }

      } else {
        transactionHashes=null;
        const pt = await addTeamMember({ gameId, supportPlayerId, userId, amount, date,gameData ,transactionHashes});
        if(pt){
            setRedirectUrl(null);
            router.push("/user/");
                setIsParticipantAdded(true);
        }

      }

    } catch (error) {
      console.error('Error adding participant:', error);
      setError(error.message || 'Error adding participant');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions

  const validateInput = ({ gameId, teamName, amount, joinAsPlayer, supportPlayerId }) => {
    
    if(joinAsPlayer){
    if (!gameId || !teamName || amount <= 0) {
      setError('Invalid input data');
      throw new Error('Invalid input data');

    }
}else{
    if (!gameId || amount <= 0) {
        setError('Invalid input data');
        throw new Error('Invalid input data');
  
      }
}

  };

  const fetchGameData = async (gameId) => {
    const gameSnap = await readDocument(GAME_COLLECTION, gameId);
    if (!gameSnap) {
        setError(`Game with ID ${gameId} does not exist.`);

      throw new Error(`Game with ID ${gameId} does not exist.`);
    }
    return gameSnap;
  };

  const addPlayer = async ({ gameData, teamName, gameId, userId, amount, date,transactionHashes }) => {
    const currentPlayers = Array.isArray(gameData.participants)
    ? gameData.participants.filter((p) => p.isPlayer)
    : [];
  
    if (currentPlayers.length >= gameData.numberOfPlayers) {
        await updateDocument(GAME_COLLECTION, gameId, {
              status:"ongoing",
            });
        
        setError('No player slots available. Please join a team instead.');

      throw new Error('No player slots available. Please join a team instead.');
    }

    const team = { ownerId: userId, teamName };
    const newPlayer = { userId: userId, teamId: currentPlayers.length, isPlayer: true };

    await updateDocument(GAME_COLLECTION, gameId, {
    //   status:"ongoing",
      team: arrayUnion(team),
      participants: arrayUnion(newPlayer),
    });

    const cId = await createContribution({ gameId, userId, amount, date,transactionHashes });
    // //console.log("------------------0",cId);
    if(cId){
        return cId;
    }
    // //console.log('Participant added as player:', newPlayer);
  };

  const addTeamMember = async ({ gameId, supportPlayerId,userId, amount, date,gameData,transactionHashes }) => {
    
    const newTeamParticipant = {
       userId: userId, 
       teamId: supportPlayerId, 
       isPlayer: false };
    // //console.log("new participant",  newTeamParticipant);
    await updateDocument(GAME_COLLECTION, gameId, {
      participants: arrayUnion(newTeamParticipant),
    });

    const coId = await createContribution({ gameId, userId, amount, date,transactionHashes });
    return coId;
  };

  const createContribution = async ({ gameId, userId, amount, date,transactionHashes }) => {
    const contributionTransaction = {
      gameId,
      userId,
      amount,
      transactionHash: transactionHashes,
      createdAt: date,
    };

    return await createDocument(CONTRIBUTION_COLLECTION, contributionTransaction);
  };

  return { addParticipant, loading, error, isParticipantAdded };
};

export default useAddParticipant;
