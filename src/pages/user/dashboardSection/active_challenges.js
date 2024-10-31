import protectedPage from "@/utils/protectedRoute";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FinishGameModal } from "@/components/FinishGameModal";
import { SHARE_LINK_URL } from "@/constants/collections";
import { useRouter } from "next/router";
import useVote from "@/hooks/firebase/useVote";
import useVotePercentage from "@/hooks/firebase/useVotePercentage";
import useFinishGame from "@/hooks/firebase/useFinishGame";

import { FaClock, FaCopy } from "react-icons/fa";
import { VotingResult } from "@/components/VotingResult";
import { BetingResult } from "@/components/BetingResult";
import { WinnerAmount } from "@/components/WinnerAmount";
import useArinaHook from "@/hooks/blockchain/useArinaHook";
import { useLocalStorage } from "usehooks-ts";
import Loader from "@/components/Loader";

import useTransactionHook from "@/hooks/blockchain/useTransactionHook";

import { useToast } from "@/hooks/use-toast";
import { RiShareBoxFill } from "react-icons/ri";
import Link from "next/link";

function ActiveChallenges({
  activeGameDetail,
  props,
  setIsLoading,
  isLoading,
}) {
  
  const [gameId, setGameId] = useState(activeGameDetail?.id);
  const [user,setUser] = useLocalStorage("user",null)
  
  const router = useRouter();
  
  const { handleClaimWinnings } = useArinaHook();
  const [actionCallBack, setActionCallBack] = useLocalStorage(
    "actionCallBack",
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const votePercentage = useVotePercentage(activeGameDetail?.id);

  const handleFinishGame = async () => {
    router.push("/user/finish_vote?gameId=" + activeGameDetail?.id); // Redirect or handle the logic here
  };

  const handleWinning = async () => {
    const betData = {
      gameId: activeGameDetail?.id,
      challengeId: activeGameDetail?.challengeId,
    };

    const result = await handleClaimWinnings({ data: betData });
    
  };

  const { getTransactionDetail } = useTransactionHook();
  const { finishGameStatus } = useFinishGame();

  useEffect(()=>{
    
  },[activeGameDetail]);

  useEffect(() => {
    setIsLoading(true);
    const processTransaction = async () => {
      if (actionCallBack?.method == "handleClaimWinnings" && !isSubmitting) {
        setIsSubmitting(true);
        try {
          // const transaction = await getTransactionDetail(props?.transactionHashes);
          // let extractedChallengeId = null;
          
          // // Iterate over the transaction logs using a for loop
          // if(props?.transactionHashes != null){
          // for (let i = 0; i < transaction?.log?.length; i++) {
          //   const outcome = transaction.log[i];
          //   for (let j = 0; j < outcome.outcome.logs.length; j++) {
          //     const log = outcome.outcome.logs[j];
          //     //console.log("Log:", log);

          //     // Optionally parse the JSON log to extract challenge_id
          //     try {
          //       const logObject = JSON.parse(log);

          //         extractedChallengeId = logObject.params;
          //         // alert(extractedChallengeId);
          //         // setChallengeId(extractedChallengeId); // Update state
          //       // }
          //     } catch (e) {
          //       // Handle non-JSON logs if necessary
          //       console.error("Non-JSON Log:", log);
          //     }
          //   }
          // }

          // if (extractedChallengeId.length) {
          await finishGameStatus(actionCallBack?.data?.gameId);
          setActionCallBack(null);
          // if(isGameCreated){
          // setActionCallBack(null);
          // router.push("/user");
        //   }

        // }
          // } else {
          //   console.error("not found in transaction logs.");
          //   // setErrors({ general: "Failed to find logs." });
          // }
        } catch (error) {
          console.error("Error during game:", error);
          // setErrors({ general: "Failed to create the game. Please try again later." });
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    processTransaction();
    setIsLoading(false);
  }, [actionCallBack?.method]);

  // Split teams into two columns (left and right of VS)
  const teamsLeft =
    activeGameDetail?.team?.slice(
      0,
      Math.ceil(activeGameDetail?.team?.length / 2)
    ) || [];
  const teamsRight =
    activeGameDetail?.team?.slice(
      Math.ceil(activeGameDetail?.team?.length / 2)
    ) || [];
  const { toast } = useToast();


  const handleShareLink = () => {
    const linkUrl = `${SHARE_LINK_URL}user/join_game?gameId=${activeGameDetail?.id}`;

    navigator.clipboard
    .writeText(linkUrl)
    .then(() => {
      toast({
        title: "Link copied",
        description: "Link copied to clipboard!",
        duration: 2000,
      });
    })
    .catch(() => {
      toast({
        title: "Failed to copy link.",
        description: "",
        duration: 2000,
      });
    
    })
  };


  const { checkVote, isVote, support } = useVote();

  useEffect(() => {
    if (activeGameDetail?.id) {
      setIsLoading(true);
      checkVote(activeGameDetail?.id); // This will check if the user has already voted
      setIsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    // //console.log(support);
  }, [isVote, support]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className=" justify-center md:flex md:justify-center pb-4 font-archivo" style={{ fontFamily: "'Archivo', sans-serif" }}>
  <div className="min-h-[350px] sm:min-w-[350px] bg-black shadow-md rounded px-1 py-1 flex flex-col justify-between items-center mt-6 space-y-6 relative">
    
    {/* Header Section */}
    <div className="w-full flex justify-between items-center py-2">
      <p className="text-[12px] md:text-[16px] text-white">Challenge ID:  {activeGameDetail?.challengeId} </p>
      <div className="h-full flex justify-end px-2">
        <img
          src="/arina-logo.png"
          alt="Right Player"
          className="object-cover h-3 md:h-4 rounded-l"
        />
      </div>
    </div>

    {/* Main Content Section */}
    <div className="flex flex-col items-center space-y-4 w-full border rounded min-h-[250px]">
      <div className="relative flex justify-between w-full h-[150px] overflow-hidden rounded-lg">
        
        {/* Left Side Image */}
        <div className="w-1/2">
          <img
            src={activeGameDetail?.team[0]?.profileImage ? activeGameDetail?.team[0]?.profileImage || "/unsplash.png"
              : "/unsplash.png"}
            alt="Left Player"
            className="object-cover w-full h-full rounded-l-lg"
          />
        </div>

        {/* Right Side Image */}
        <div className="w-1/2">
          <img
                       src={activeGameDetail?.team[1]?.profileImage ? activeGameDetail?.team[1]?.profileImage || "/unsplash.png"
                        : "/unsplash.png"}

            alt="Right Player"
            className="object-cover w-full h-full rounded-r-lg"
          />
        </div>
        
        
        {/* Slanted Divider */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-transparent rotate-6 transform skew-x-[20deg] w-full h-full pointer-events-none" /> */}
      </div>

      {/* VS and Player Info Section */}
      <div className="w-full flex justify-between px-2">
        
        {/* Left Player Info */}
        <div className="w-1/2 text-right flex justify-content-center">
        {(teamsLeft.length > 0
  ? teamsLeft
  : Array(1).fill(null)
).map((team, index) => (
  <div key={index} className="flex flex-col items-center">
    <p className="text-[12px] md:text-[15px] font-bold text-white">
      {team?.teamName || "Waiting"}
    </p>
    {/* {activeGameDetail?.team0Participants ? (
      <p className="text-[10px] md:text-[13px] text-[#7DA4FF]">
        & {activeGameDetail?.team0Participants} MORE...
      </p>
    ) : (
      <p className="text-[10px] md:text-[13px] text-[#7DA4FF]">No participants</p>
    )} */}

{activeGameDetail?.team0Participants > 1 ? (
  <p className="text-[10px] md:text-[13px] text-[#7DA4FF]">
    & {activeGameDetail?.team0Participants} MORE...
  </p>
) : (
  <p className="text-[10px] md:text-[13px] text-[#7DA4FF]"></p>
)}
  </div>
))}
      
      
          </div>

        <p className="text-[24px] font-bold text-newSecondary px-2">vs</p>

        {/* Right Player Info */}
        
        <div className="w-1/2 text-left flex justify-content-center">
        {(teamsRight.length > 0
  ? teamsRight
  : Array(1).fill(null)
).map((team, index) => (
  <div key={index} className="flex flex-col items-center">
    <p className="text-[12px] md:text-[15px] font-bold text-white">
      {team?.teamName || "Waiting"}
    </p>
    {/* {activeGameDetail?.team1Participants ? (
      <p className="text-[10px] md:text-[13px] text-[#7DA4FF]">
        & {activeGameDetail?.team1Participants} MORE...
      </p>
    ) : (
      <p className="text-[10px] md:text-[13px] text-[#7DA4FF]">No participants</p>
    )} */}
{activeGameDetail?.team1Participants > 1 ? (
  <p className="text-[10px] md:text-[13px] text-[#7DA4FF]">
    & {activeGameDetail?.team1Participants} MORE...
  </p>
) : (
  <p className="text-[10px] md:text-[13px] text-[#7DA4FF]"></p>
)}
  </div>
))}
          </div>
      </div>

      {/* Amount and Betting History Section */}
      <div className="w-full flex justify-between items-center px-3 py-2">
        <p className="text-center text-[24px] md:text-[24px] font-bold text-newSecondary">$ {activeGameDetail?.totalContribution}</p>
        {/* <p className="text-[15px] md:text-[15px] text-white cursor-pointer">View Betting History</p> */}
        <BetingResult challangeId={activeGameDetail?.challengeId} />
     
      </div>
    </div>

    {/* Footer Section */}
    <div className="w-full flex justify-around items-center px-2 mt-2 border border-gray-300 rounded py-2">
      <Link
        
                      href={"https://testnet.nearblocks.io/address/"+user?.walletAddress}
                      target="_blank"
                      className="bg-[#111922] px-0 py-0 hover:scale-[1.1]"
                    >
                      {/* <p> */}
                      <FaClock className="text-white" size={24} />

      {/* </p> */}
      </Link>
      <div
  className={`${
    activeGameDetail?.status === "finished"
      ? "bg-[#EFBD4E]" // Yellow background when status is "finished"
      : "bg-[#E14449]" // Default background color
  } text-[12px] w-1/2 md:text-[20px] text-center text-white font-semibold px-4 py-2`}>
     {activeGameDetail?.status != "voting" && activeGameDetail?.status != "finished" ? (
             
                  <FinishGameModal onClick={handleFinishGame} gameId={activeGameDetail?.id} />
               
              ) : (
                <>
                  {!isVote && activeGameDetail?.status != "finished"  ? (
                    <FinishGameModal
                      onClick={handleFinishGame}
                      gameId={activeGameDetail?.id}
                    />
                  ) : (
                    <>
                      
                        {activeGameDetail?.status == "finished" ? (
                          <WinnerAmount
                          challangeId={activeGameDetail?.challengeId}
                        />
                        ):(
                          <>
                           {votePercentage.toFixed(2) == 100 ? (
                             <div
                             className="bg-transparent text-white  w-full min-w-full hover:scale-[1.1]"
                             onClick={handleWinning}
                              style={{ 
                                cursor: "pointer"
                               }}
                           >
                             DISTRIBUTE
                               
                           </div>
                         
                        ):(
                          <VotingResult
                          challangeId={activeGameDetail?.challengeId}
                        />
                        )}
                          
                          </>
                         
                        )}
                       

                        {/*  */}

                       
                      
                    </>
                  )}
                </>
              )}
        {/* FINISH */}
      </div>

      <Button
  onClick={handleShareLink}
  className={`bg-[#111922] px-0 py-0 ${
    activeGameDetail?.status === "voting" || activeGameDetail?.status === "finished"
      ? "opacity-50 cursor-not-allowed"
      : "hover:scale-[1.1]"
  }`}
  disabled={activeGameDetail?.status === "voting" || activeGameDetail?.status === "finished"}
>
  <RiShareBoxFill className="text-white" size={24} />
</Button>
   
   
    </div>
  </div>
</div>
        </>
      )}
    </>
  );
}

export default protectedPage(ActiveChallenges);
