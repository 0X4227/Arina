import { useState } from 'react';
import { updateDocument, readDocument } from '@/api/firebase/master/firestoreCrud';
import { GAME_COLLECTION } from '@/constants/collections';
import { useRouter } from 'next/router';

const useFinishGame = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const router = useRouter();

  const finishGameStatus = async (gameId) => {
    setLoading(true);
    setError(null);

    try {
     
      // Change the status to "finished"
      await updateDocument(GAME_COLLECTION, gameId, {
        status: 'finished',
      });

      setIsGameFinished(true);
      // alert("Game Finished");
      setActionCallBack(null);
      router.push(`/user`); // Optional: Redirect to game details page
    } catch (error) {
      console.error('Error finishing game status:', error);
      setError(error.message || 'Error finishing game status');
    } 
  };

  // Helper function to fetch game data
  const fetchGameData = async (gameId) => {
    const gameSnap = await readDocument(GAME_COLLECTION, gameId);
    if (!gameSnap) {
      setError(`Game with ID ${gameId} does not exist.`);
      throw new Error(`Game with ID ${gameId} does not exist.`);
    }
    return gameSnap;
  };

  return { finishGameStatus, loading, error, isGameFinished };
};

export default useFinishGame;
