import { createDocument, getDocumentsByQuery, readDocumentsByField, updateDocument } from '@/api/firebase/master/firestoreCrud';
import { GAME_COLLECTION, VOTE_COLLECTION } from '@/constants/collections';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useToast } from '../use-toast';

const useVote = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useLocalStorage("user", null);
  const [isVote, setIsVote] = useState(false);
  const [support,setSupport] = useState([]);
  const userId = user?.id;
  const router = useRouter();
  const [actionCallBack, setActionCallBack] = useLocalStorage("actionCallBack");
  const { toast } = useToast();

  // Helper to set loading and errors
  const setStatus = (loadingStatus, errorMessage = null) => {
    setLoading(loadingStatus);
    setError(errorMessage);
    setLoading(false);

  };

  // Check if the user has already voted
  const checkExistingVotes = async (gameId, userId) => {
    setLoading(true);
    try {
      const existingVotes = await getDocumentsByQuery(VOTE_COLLECTION, [
        { field: 'gameId', operator: '==', value: gameId },
        { field: 'createdBy', operator: '==', value: userId }
      ]);
      setLoading(false);
      return existingVotes.length > 0;
    } catch (error) {
      console.error('Error checking existing votes:', error);
      setStatus(false, 'Failed to check for existing votes. Please try again.');
      setLoading(false);
      // return existingVotes.length > 0;

      return false;
    }
  };



  // Submit a vote for a winner
  const voteForWinner = async ({ gameId, voteFor,transactionHash }) => {
    setStatus(true, null);
    setLoading(true);
   if (!user) {
      setStatus(false, 'You must be logged in to vote.');
      setLoading(false);
      return;
    }

    if (!Array.isArray(voteFor) || voteFor.length === 0) {
      setStatus(false, 'Please select a team to vote for.');
      toast({
        variant: "destructive",
        title: "Please select a team to vote for.",
        description: "",
        duration: 2000,
      });
      // alert("Please select a team to vote for.");
      setLoading(false);
      return;
    }

    const hasVoted = await checkExistingVotes(gameId, userId);
    if (hasVoted) {
      setStatus(false, 'You have already voted for this game.');
      toast({
        variant: "destructive",
        title: "You have already voted for this game.",
        description: "",
        duration: 2000,
      });
      // alert("You have already voted for this game.");
      setLoading(false);
      return;
    }

    const date = Math.floor(new Date().getTime() / 1000);
    const voteData = {
      gameId,
      date,
      voteFor,
      transactionHash,
      createdBy: userId,
      createdAt: date,
    };

    try {
    
   
      const docId = await createDocument(VOTE_COLLECTION, voteData);
   
      if (docId) {
        await updateDocument(GAME_COLLECTION, gameId, { status: "voting" });
       
        // await calculateParticipantsAndCheckStatus(gameId);
        toast({
          title: "Vote successfully submitted!",
          description: "",
          duration: 2000,
        });
        // alert("Vote successfully submitted!");
        setActionCallBack(null);
        setLoading(false);
        router.push(`/user`); // Navigate to the user page after a successful vote
      }
      setLoading(false);

    } catch (error) {
      console.error('Error creating vote:', error);
      setStatus(false, error.code === 'permission-denied'
        ? 'You do not have permission to vote. Please contact support.'
        : 'Failed to submit your vote. Please try again later.');
      setLoading(false);

    } finally {
      setLoading(false);
    }
  };

  // Check if the user has already voted for a game
  const checkVote = async (gameId) => {
    setStatus(true, null);
    setLoading(true);
    if (!user) {
      setStatus(false, 'You must be logged in to check votes.');
      setLoading(false);
      return;
    }

    if (!gameId) {
      setStatus(false, 'Invalid game ID.');
      setLoading(false);
      return;
    }

    try {
      const existingVotes = await readDocumentsByField(VOTE_COLLECTION, 'gameId', gameId);

      if (existingVotes && existingVotes.length > 0) {
        const existingVote = existingVotes[0];
        
        const hasVoted = existingVotes.some(vote => vote.createdBy === userId);
        const userVote = existingVotes.find(vote => vote.createdBy === userId);

        if (hasVoted) {

        // alert(hasVoted)
          setIsVote(true);
          setSupport(userVote.voteFor);
          setLoading(false);

        } else {
          setIsVote(false);
           setLoading(false);

        }
      } else {
        setIsVote(false);

      setLoading(false);

      }
      
    } catch (error) {
      console.error('Error checking votes:', error);
      setStatus(false, 'Failed to check for existing votes. Please try again later.');
      setLoading(false);

    } finally {
      setLoading(false);
      
    }
  };

  return { voteForWinner, checkVote, isVote,support, loading, error };
};

export default useVote;
