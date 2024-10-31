import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore"; 
import { CONTRIBUTION_COLLECTION, GAME_COLLECTION } from "@/constants/collections";
import { readDocumentsByField,readDocument,readDocumentsByOrdered } from '@/api/firebase/master/firestoreCrud';

const useGameHistory = (userId) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const contributions = await readDocumentsByOrdered(
          CONTRIBUTION_COLLECTION,
          "userId",
          userId,
          "createdAt",
          "desc"
        );
        //console.log("Contribution",contributions);
        if (!contributions || contributions.length === 0) {
          setGameHistory([]);
          setLoading(false);
          return;
        }

        // Array to hold the contributions with game data
        const gameHistoryData = [];

        for (const contribution of contributions) {
          const gameId = contribution.gameId;

          // Fetch the game data for each contribution
          const gameDoc = await readDocument(GAME_COLLECTION,gameId);

          if (gameDoc) {
            // Combine contribution data with game data
            gameHistoryData.push({
              ...contribution,
              gameData: gameDoc,
            });
          } else {
            console.error(`Game not found for gameId: ${gameId}`);
          }
        }

        setGameHistory(gameHistoryData);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching contributions with games:", err);
        setError("Failed to fetch contributions with game data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchGameHistory();
    }
  }, [userId]);

  return { gameHistory, loading, error };
};

export default useGameHistory;
