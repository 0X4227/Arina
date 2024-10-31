import { Button } from "@/components/ui/button";
// import protectedPage from "@/utils/protectedRoute";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import useFetchGameDetails from "@/hooks/firebase/useFetchGameDetails";
import { useEffect, useState } from "react";
import useAddParticipant from "@/hooks/firebase/useAddParticipant";
import { useLocalStorage } from "usehooks-ts";
import ChallengeOpponent from "@/pages/user/dashboardSection/challenge_opponent";
import useArinaHook from "@/hooks/blockchain/useArinaHook";
import useTransactionHook from "@/hooks/blockchain/useTransactionHook";
import Loader from "@/components/Loader";

import Header from "@/components/Header";
import useTokenHook from "@/hooks/blockchain/useTokenHook";
import { TOKEN_CONTRACT } from "@/constants/veriables";
import { useToast } from "@/hooks/use-toast";
function JoinChallenge() {
  const router = useRouter();
  const { gameId, errorCode, errorMessage, transactionHashes } = router.query;
  const [players, setPlayers] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [gId, setGId] = useState(null);
  const [contributionAmount, setContributionAmount] = useState(""); // State for contribution
  const [errors, setErrors] = useState({}); // State for validation errors
  const { addParticipant, isParticipantAdded } = useAddParticipant();
  const { gameData, totalContributionAmount } = useFetchGameDetails(gameId);
  const [actionCallBack, setActionCallBack] = useLocalStorage("actionCallBack", null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useLocalStorage("user", null);
  const [teamName, setTeamName] = useState(user?.walletAddress?.replace(/\.near|\.testnet$/, ''));
  const { userBalance } = useTokenHook(
    TOKEN_CONTRACT
  );
  const [isLoading, setIsLoading] = useState(false);
  const { handleAcceptBet } = useArinaHook();
  const [redirectUrl, setRedirectUrl] = useLocalStorage("redirectUrl", "");
  const { toast } = useToast();


  useEffect(() => {
    if (gameData) {
      setPlayers(gameData?.team);
      setGameName(gameData?.name || null);
      setGId(gameData?.id || null);
      //console.log(gameData);
      // alert(gameId);
    }
  }, [gameData]);

  useEffect(() => {
    if (gameData?.numberOfPlayers <= gameData?.team?.length && actionCallBack != null) {
      // alert ("Already player onboarding");
      toast({
        variant: "destructive",
        title: "Already player onboarding",
        description: "",
        duration: 2000,
      });
      const supporterUrl = `/user/guess_winner?gameId=` + gameData?.id;
      setRedirectUrl(supporterUrl); // Store the URL in local storage
      router.push(supporterUrl);
    }
    if (gameData?.status == "finished" || gameData?.status == "voting") {
      toast({
        variant: "destructive",
        title: "The link has expired.",
        description: "",
        duration: 2000,
      });
      // alert ("The link has expired.");
      localStorage.removeItem('redirectUrl');
      router.push("/user/");
    }
  }, [gameData]);

  // Input change handlers
  const handleContributionChange = (e) => {
    setContributionAmount(e.target.value);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (gameData.numberOfPlayers <= gameData.team.length) {
      newErrors.contributionAmount = "Already player onboarding";
    }

    if (!contributionAmount) {
      newErrors.contributionAmount = "Contribution amount is required";
    } else if (isNaN(contributionAmount) || Number(contributionAmount) <= 0) {

      newErrors.contributionAmount = "Enter a valid number greater than 0";
    }
    // else if(contributionAmount >= userBalance){
    //   newErrors.contributionAmount = "Insufficient balance";
    // }

    if (!teamName) {
      newErrors.teamName = "Team name is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle the form submission
  const handleJoinChallenge = async () => {
    setIsLoading(true);

    if (validateForm()) {

      const betData = {
        gameId: gameId,
        teamName: teamName,
        joinAsPlayer: true,
        supportPlayerId: null,
        amount: contributionAmount,
        challengeId: gameData?.challengeId
      };

      const result = await handleAcceptBet({ data: betData });

      setIsLoading(false);

    }
    setIsLoading(false);

  };
  const { getTransactionDetail } = useTransactionHook();


  useEffect(() => {
    setIsLoading(true);

    const processTransaction = async () => {
      if (transactionHashes && actionCallBack && !isSubmitting) {
        setIsSubmitting(true);
        try {
          const transaction = await getTransactionDetail(transactionHashes);
          let extractedChallengeId = null;

          // Iterate over the transaction logs using a for loop
          for (let i = 0; i < transaction?.log?.length; i++) {
            const outcome = transaction.log[i];
            for (let j = 0; j < outcome.outcome.logs.length; j++) {
              const log = outcome.outcome.logs[j];

              // Optionally parse the JSON log to extract challenge_id
              try {
                const logObject = JSON.parse(log);
                if (logObject.type === "BetOnly") {
                  //console.log("Challenge ID:", logObject.params);
                  extractedChallengeId = logObject.params.challenge_id;


                }
              } catch (e) {
                // Handle non-JSON logs if necessary
                console.error("Non-JSON Log:", log);
                setIsLoading(false);

              }
            }
          }

          if (extractedChallengeId) {

            await addParticipant({
              gameId: actionCallBack.data.gameId,
              teamName: actionCallBack.data.teamName,
              joinAsPlayer: actionCallBack.data.joinAsPlayer,
              supportPlayerId: actionCallBack.data.supportPlayerId,
              amount: actionCallBack.data.amount,
              transactionHashes: transactionHashes
            });

            setIsLoading(false);


          } else {
            console.error("Challenge ID not found in transaction logs.");
            setErrors({ general: "Failed to find Challenge ID in logs." });
            setIsLoading(false);

          }
        } catch (error) {
          console.error("Error during game creation:", error);
          setErrors({ general: "Failed to create the game. Please try again later." });
          setIsLoading(false);

        } finally {
          setIsSubmitting(false);
          setIsLoading(false);

        }
      }
    };

    processTransaction();
    setIsLoading(false);

  }, [transactionHashes]);

  const handleBack = () => {
    localStorage.removeItem('redirectUrl');
    router.push("/user/");
  };

  return (
    // <div className="min-h-screen bg-gradient-custom px-4 pt-10">
    <div className="min-h-screen px-4 pt-10">

      <div className="md:container">
        {isLoading ? (<><Loader /></>) : (<>



          <div className="md:container">
            <div className="flex md:justify-center my-2">
              <h1 className="text-2xl md:text-4xl font-bold text-newSecondary mb-4">
                You have been challenged
              </h1>
            </div>

            <ChallengeOpponent
              gameData={gameData}
              gameName={gameName}
              players={players}
              totalContributionAmount={totalContributionAmount}
            />



            {/* Contribution Field */}
            <div className="flex justify-center rounded-md w-full">
              <div className="md:w-full lg:w-[50%]">
                <label className="block text-black font-bold mb-2">Amount</label>
                <Input
                  type="text"
                  value={contributionAmount}
                  onChange={handleContributionChange}
                  placeholder="Enter your contribution in $"
                  className="w-full px-4 py-2 border-b-2 border-blue-500 bg-white text-black placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
                {errors.contributionAmount && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.contributionAmount}
                  </p>
                )}
              </div>
            </div>

            <div className="pb-4 flex justify-center mt-5">
          <Button
            onClick={handleJoinChallenge}
            className="bg-newSecondary hover:bg-orange-600 text-white py-2 px-4 rounded-full w-48 hover:scale-[1.1]"
          >
            Join
          </Button>
        </div>
          </div>
          <div className="w-full fixed bottom-0 left-0">
            <div className="flex justify-center py-4">


              <Header/>


            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}

export default JoinChallenge;
