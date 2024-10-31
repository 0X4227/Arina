import { readDocument, readDocumentsByField } from '@/api/firebase/master/firestoreCrud';
import { CONTRIBUTION_COLLECTION, GAME_COLLECTION, USER_COLLECTION } from '@/constants/collections';
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, query, where } from 'firebase/firestore'; // Ensure these imports are correct based on your setup
import { firestore } from '@/firebase/firebaseConfig'; // Assuming you have configured Firestore

const useFetchGameDetails = (gameId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [totalContributionAmount, setTotalContributionAmount] = useState(0);

  useEffect(() => {
    if (gameId) {
      fetchGameDetails(gameId);
    }
  }, [gameId]);

  const fetchGameDetails = async (gameId) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the game data by ID
      const filteredGame = await readDocument(GAME_COLLECTION, gameId);
      let gameDoc = null;

      if (filteredGame && filteredGame.status !== 'finished') {
        gameDoc = filteredGame;
      }

      if (gameDoc) {
        // Fetch and update owner details for each team
        const updatedTeams = await Promise.all(
          gameDoc.team.map(async (team) => {
            try {
              const ownerDocRef = doc(firestore, USER_COLLECTION, team.ownerId);
              const ownerDoc = await getDoc(ownerDocRef);
              const ownerData = ownerDoc.exists() ? ownerDoc.data() : {};

              return {
                ...team,
                profileImage: ownerData?.profileImage || '/user.png', // Fallback to a default image path
              };
            } catch (ownerError) {
              console.error('Error fetching owner details:', ownerError);
              return {
                ...team,
                profileImage: '/user.png',
              };
            }
          })
        );

        //console.log("Fetched Game Details:", gameDoc);

        // Update the game with the new team details
        setGameData({ ...gameDoc, team: updatedTeams });

        // Fetch the contribution data related to the gameId
        const contributionDocs = await readDocumentsByField(CONTRIBUTION_COLLECTION, 'gameId', gameId);

        if (contributionDocs) {
          setContributionData(contributionDocs);
          const totalAmount = contributionDocs.reduce((sum, doc) => sum + Number(doc.amount || 0), 0);
          setTotalContributionAmount(totalAmount);
        }
      }
    } catch (error) {
      console.error('Error fetching game or contribution data:', error);
      setError(error.message || 'Error fetching game or contribution data');
    } finally {
      setLoading(false);
    }
  };

  return { gameData, contributionData, totalContributionAmount, loading, error };
};

export default useFetchGameDetails;

