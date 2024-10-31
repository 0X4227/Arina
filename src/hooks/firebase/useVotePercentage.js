import { useState, useEffect } from 'react';
import { GAME_COLLECTION, VOTE_COLLECTION } from '@/constants/collections';
import { firestore } from '@/firebase/firebaseConfig';

const useVotePercentage = (gameId) => {
  const [votePercentage, setVotePercentage] = useState(0);

  useEffect(() => {
    if (!gameId) return;

    // Function to calculate the percentage of votes
    const calculateParticipantsAndCheckStatus = () => {
      try {
        // Subscribe to votes collection for real-time updates
        const unsubscribeVotes = firestore
          .collection(VOTE_COLLECTION)
          .where('gameId', '==', gameId)
          .onSnapshot((snapshot) => {
            const allVotes = snapshot.docs.map((doc) => doc.data());

            // Subscribe to game collection for real-time updates on participants
            const unsubscribeGame = firestore
              .collection(GAME_COLLECTION)
              .where('id', '==', gameId)
              .onSnapshot((gameSnapshot) => {
                const game = gameSnapshot.docs.map((doc) => doc.data());
                const totalParticipants = game[0]?.participants.length ?? 0;

                if (totalParticipants === 0) {
                  console.warn('No participants found for this game.');
                  setVotePercentage(0); // Set 0 if there are no participants
                  return;
                }

                // Calculate the percentage of votes cast
                const voteCount = allVotes.length;
                const votePercentage = (voteCount / totalParticipants) * 100;
                setVotePercentage(votePercentage);
              });

            // Cleanup for game snapshot listener
            return () => unsubscribeGame();
          });

        // Cleanup for votes snapshot listener
        return () => unsubscribeVotes();
      } catch (error) {
        console.error('Error calculating participants:', error);
        setVotePercentage(0); // Set 0 on error
      }
    };

    // Start calculating on hook mount
    const unsubscribe = calculateParticipantsAndCheckStatus();

    // Cleanup listeners on hook unmount or gameId change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [gameId]);

  return votePercentage;
};

export default useVotePercentage;
