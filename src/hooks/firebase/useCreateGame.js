import { createDocument } from '@/api/firebase/master/firestoreCrud';
import { CONTRIBUTION_COLLECTION, GAME_COLLECTION } from '@/constants/collections';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import useTransactionHook from '@/hooks/blockchain/useTransactionHook';

const GAME_STATUS = {
  PENDING: 'pending',
  ONGOING: 'ongoing',
  FINISHED: 'finished',
};

const useCreateGame = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useLocalStorage("user", null);
  const [gameDetail, setGameDetail] = useLocalStorage("gameDetail", null);
  const [isGameCreated, setIsGameCreated] = useLocalStorage("gameCreated", false);

  const wallet = user?.walletAddress;
  const userId = user?.id;
  // const { getTransactionDetail } = useTransactionHook();

  const createGame = async ({ gameName, teamName, amount, transactionHashes,challengeId }) => {
    setLoading(true);
    setError(null);
    
    try {
      const date = Math.floor(new Date().getTime() / 1000);

      const gameData = {
        name: gameName,
        date: date,
        status: GAME_STATUS.PENDING,
        winner: null,
        numberOfPlayers: 2,
        createdBy: userId,
        createdAt: date,
        challengeId: challengeId, // Use the fetched challengeId directly
        team: [
          {
            ownerId: userId,
            teamName: teamName,
          },
        ],
        participants: [
          {
            userId: userId,
            teamId: 0,
            isPlayer: true,
          },
        ],
      };

      // Create the game document in Firestore
      const gameId = await createDocument(GAME_COLLECTION, gameData);
      if (!gameId) {
        throw new Error("Failed to create game document");
      }

      const contributionTransaction = {
        gameId: gameId,
        userId: userId,
        amount: amount,
        transactionHash: transactionHashes,
        createdAt: date,
      };

      // Create the contribution document in Firestore
      const contriId = await createDocument(CONTRIBUTION_COLLECTION, contributionTransaction);
      if (!contriId) {
        throw new Error("Failed to create contribution document");
      }

      // Save details in local storage
      setGameDetail({
        gameData,
        contributionTransaction,
      });
      setIsGameCreated(true);

    } catch (error) {
      console.error('Error creating game:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { createGame, loading, error, isGameCreated, setIsGameCreated };
};

export default useCreateGame;


