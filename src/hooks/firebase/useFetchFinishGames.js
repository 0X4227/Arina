import { useState, useEffect } from 'react';
import { query, where,doc, getDocs, collection, getDoc } from 'firebase/firestore';
import { GAME_COLLECTION, CONTRIBUTION_COLLECTION,VOTE_COLLECTION,USER_COLLECTION } from '@/constants/collections';
import { firestore } from '@/firebase/firebaseConfig'; // Assuming you have configured Firestore
import { useLocalStorage } from 'usehooks-ts'; // Assuming this is used for user persistence
import { createDocument, getDocumentsByQuery, readDocumentsByField, updateDocument } from '@/api/firebase/master/firestoreCrud';

const useFetchFinishGames = () => {
  const [pastGames, setPastGames] = useState([]);
  const [pastLoading, setPastLoading] = useState(false);
  const [pastError, setPastError] = useState(null);

  const [user] = useLocalStorage('user', null); // Get the logged-in user from local storage
  const userId = user?.id;

  useEffect(() => {
    const fetchPastGames = async () => {
      if (!userId) {
        setPastError('User is not logged in');
        return;
      }
  
      setPastLoading(true);
      setPastError(null);
  
      try {
        // Query for games with status not equal to 'finished'
        const ongoingQuery = query(
          collection(firestore, GAME_COLLECTION),
          where('status', '==', 'finished')
        );
  
        // Execute the query
        const ongoingSnapshot = await getDocs(ongoingQuery);
  
        // Extract ongoing games data
        const ongoingGames = ongoingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Filter games where logged-in user is present in participants array
        const userPastGames = ongoingGames.filter(
          (game) =>
            game.participants &&
            game.participants.some((participant) => participant.userId === userId)
        );
  
        // Fetch owner details and contributions for each game
        const gamesWithDetails = await Promise.all(
          userPastGames.map(async (game) => {
            // Fetch and update owner details for each team
            const updatedTeams = await Promise.all(
              game.team.map(async (team) => {
                // Fetch the owner profile from the user collection
                const ownerDocRef = doc(firestore, USER_COLLECTION, team.ownerId);
                const ownerDoc = await getDoc(ownerDocRef);
                const ownerData = ownerDoc.exists() ? ownerDoc.data() : {};
  
                return {
                  ...team,
                  profileName: ownerData.profileName || ownerData.walletAddress || 'Unknown User',
                  profileImage: ownerData.profileImage, // Fallback to a default image
                };
              })
            );
  
            // Update the game with the new team details
            game.team = updatedTeams;
  
            // Query contributions related to the current game
            const contributionsQuery = query(
              collection(firestore, CONTRIBUTION_COLLECTION),
              where('gameId', '==', game.id)
            );
  
            const contributionsSnapshot = await getDocs(contributionsQuery);
            const totalContribution = contributionsSnapshot.docs.reduce(
              (sum, doc) => {
                const contributionData = doc.data();
                return sum + (Number(contributionData.amount) || 0); // Sum the contribution amounts
              },
              0
            );
  
            const team0Participants = game.participants.filter(
              (participant) => participant.teamId === 0
            ).length;
            const team1Participants = game.participants.filter(
              (participant) => participant.teamId === 1
            ).length;
  
            let votePercentage = 0;
            if (game.status === 'voting') {
              votePercentage = await calculateParticipantsAndCheckStatus(game.id);
            }
  
            return {
              ...game,
              totalContribution, // Add the total contribution to the game data
              team0Participants, // Add the total participants of team 0
              team1Participants, // Add the total participants of team 1
              votePercentage,
            };
          })
        );
  
        setPastGames(gamesWithDetails);
      } catch (err) {
        console.error('Error fetching active games and contributions:', err);
        setPastError(err.message || 'Failed to fetch active games');
      } finally {
        setPastLoading(false);
      }
    };
  
    fetchPastGames();
  }, [userId]); // Refetch when the userId changes
  



  const calculateParticipantsAndCheckStatus = async (gameId) => {
    try {
      // Fetch all votes for this game
      const allVotes = await readDocumentsByField(VOTE_COLLECTION, 'gameId', gameId);
  
      // Fetch the game document to get the total number of participants
      const game = await readDocumentsByField(GAME_COLLECTION, 'id', gameId);
      const totalParticipants = game[0]?.participants.length ?? 0;
  
      if (totalParticipants === 0) {
        console.warn('No participants found for this game.');
        return;
      }
  
      // Calculate the percentage of votes cast
      const voteCount = allVotes.length;
      const votePercentage = (voteCount / totalParticipants) * 100;
      return votePercentage;
    
    } catch (error) {
      console.error('Error calculating participants:', error);
      setStatus(false, 'Failed to calculate participants. Please try again later.');
    }
  };

  return { pastGames, pastLoading, pastError };
};

export default useFetchFinishGames;


