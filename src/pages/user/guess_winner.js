import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import protectedPage from "@/utils/protectedRoute";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import useFetchGameDetails from "@/hooks/firebase/useFetchGameDetails";
import useAddParticipant from "@/hooks/firebase/useAddParticipant";
import useArinaHook from "@/hooks/blockchain/useArinaHook";
import Loader from "@/components/Loader";

import { useUser } from "@/hooks/firebase/useUser";
import useTransactionHook from "@/hooks/blockchain/useTransactionHook";
import { useLocalStorage } from "usehooks-ts";
import Header from "@/components/Header";
import useTokenHook from "@/hooks/blockchain/useTokenHook";
import { TOKEN_CONTRACT } from "@/constants/veriables";
import { useToast } from "@/hooks/use-toast";
function GuessWinner() {
  const router = useRouter();
  const { gameId,transactionHashes } = router.query;
  const { gameData } = useFetchGameDetails(gameId);
  const [supporterUserId, setSupporterUserId] = useState(null); // State to track selected player
  const [isLoading, setIsLoading] = useState(false);

  const [players, setPlayers] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [gId, setGId] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [error, setError] = useState("");
  const [supporterId, setSupporterId] = useState(null); // State to track selected player
  const [actionCallBack, setActionCallBack] = useLocalStorage("actionCallBack", null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {addParticipant,isParticipantAdded} = useAddParticipant();
  const {handleAcceptSupporterBet } = useArinaHook();
  const { userBalance } = useTokenHook(
    TOKEN_CONTRACT
  );
  const { getWalletAddressById } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (gameData) {
      setPlayers(gameData?.team || []);
      setGameName(gameData?.name || "Unknown Game");
      setGId(gameData?.id || null);
    }
  }, [gameData]);

  const handleInputChange = (e) => {
    setIsLoading(true);
    const value = e.target.value;
    setBetAmount(value);

    if (value && (isNaN(value) || Number(value) <= 0)) {
      toast({
        variant: "destructive",
        title: "Please enter a valid positive number",
        description: "",
        duration: 2000,
      });
   
    } else {
      setError("");
    }
    setIsLoading(false);

  };

  const handleConfirm = async() => {
    setIsLoading(true);

    
    if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
      setError("Please enter a valid positive amount");
     
    } else if (supporterId === null) {
      setError("Please select a team to support.");
    // } else if(betAmount >= userBalance){
      // setError("Insufficient balance");
    } else {
      setError("");
      const walletAddress = await getWalletAddressById(supporterUserId);
    
      const betData ={
        gameId:gameId,
        teamName:null,
        joinAsPlayer:false,
        supportPlayerId:supporterId,
        supporterId:walletAddress,
        amount:betAmount,
        challengeId:gameData?.challengeId
      };
      
      const result = await handleAcceptSupporterBet({ data:betData});
    setIsLoading(false);

    }
    setIsLoading(false);

  };

  const handleSelectPlayer = (index,owner) => {
    setSupporterId(index); // Set supporterId as the team index
    setSupporterUserId(owner);

  };

  const handleBack = () => {
    localStorage.removeItem('redirectUrl');
    router.push("/user/");
};



const { getTransactionDetail } = useTransactionHook();

useEffect(() => {
  if(gameData?.status == "finished" ||  gameData?.status == "voting"){
    // alert ("The link has expired.");
    toast({
      variant: "destructive",
      title: "The link has expired.",
      description: "",
      duration: 2000,
    });
    localStorage.removeItem('redirectUrl');
    router.push("/user/");
  }
}, [gameData]);

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
            supportPlayerId:actionCallBack.data.supportPlayerId,
            amount:actionCallBack.data.amount,
            transactionHashes:transactionHashes            
          });
        
          
          
  setIsLoading(false);

        } else {
          console.error("Challenge ID not found in transaction logs.");
          toast({
            variant: "destructive",
            title: "Challenge ID not found in transaction logs.",
            description: "",
            duration: 2000,
          });
         
          setIsLoading(false);

        }
      } catch (error) {
       
        toast({
          variant: "destructive",
          title: "Failed to create the game. Please try again later.",
          description: "",
          duration: 2000,
        });
       
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

  return (
  // <div className="min-h-screen bg-gradient-custom px-4 pt-10">
  <div className="min-h-screen px-4 pt-10">

      <div className="md:container">
        {isLoading ? (<><Loader/></>):(<>




      <div className="md:container md:px-36">
        <div className="flex md:justify-center my-2">
          <h1 className="text-2xl md:text-4xl font-bold text-newSecondary mb-4">
            Who will win?
          </h1>
        </div>

        <div className="mt-3">
          <p className="flex justify-center text-2xl md:text-4xl font-bold text-newSecondary md:text-center">
            {gameName}
          </p>
        </div>

        <div className="flex flex-col md:flex-row w-full items-center justify-between md:justify-center gap-10 md:gap-40 mt-4 md:mt-4">
          {players?.length > 0 ? (
            players.map((player, index) => (
              <div
                key={index}
                className={`w-[130px] h-[130px] min-w-[130px] min-h-[130px] bg-black border shadow-md rounded-[25px] p-4 flex flex-col justify-center items-center hover:border hover:border-newSecondary hover:border-4 cursor-pointer
                  ${supporterId === index ? "border-newSecondary border-4" : ""}`}
                  onClick={() => handleSelectPlayer(index, player.ownerId)}
              >
                <div className="flex flex-col items-center space-y-2 hover:scale-[1.1]">
                  <div className="w-[60px] h-[60px] bg-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={player.profileImage || "/user.png"}
                      alt={`Profile of ${player.teamName}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-[13px] text-newSecondary font-bold">
                    {player.teamName}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-black">No players available</p>
          )}
        </div>

        <div className="flex justify-center rounded-md w-full mt-5 px-3">
          <Input
            type="text"
            value={betAmount}
            onChange={handleInputChange}
            placeholder="Enter the amount $"
            className="md:w-[50%] px-4 py-2 border-b border-newSecondary bg-white text-black outline-none placeholder-blue-300"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
        )}

        <div className="pb-4 flex justify-center mt-5">
          <Button
            className="bg-newSecondary hover:bg-orange-600 text-white py-2 px-4 rounded-full w-48 hover:scale-[1.1]"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
        <div className="w-full fixed bottom-0 left-0">
    <div className="flex justify-center py-4">
     


<Header />


    </div>
  </div>
      </div>
      </>
      )}
      </div>
    </div>
  );
}

export default protectedPage(GuessWinner);
