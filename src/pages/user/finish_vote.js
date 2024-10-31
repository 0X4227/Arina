import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import protectedPage from "@/utils/protectedRoute";
import { useRouter } from "next/router";
import useFetchGameDetails from "@/hooks/firebase/useFetchGameDetails";
import useVote from "@/hooks/firebase/useVote";
import { useLocalStorage } from "usehooks-ts";
import { useUser } from "@/hooks/firebase/useUser";
import useArinaHook from "@/hooks/blockchain/useArinaHook";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

function FinishVote() {
  const router = useRouter();
  const { gameId, transactionHashes } = router.query;
  const { gameData } = useFetchGameDetails(gameId);
  const [user, setUser] = useLocalStorage("user");
  const [players, setPlayers] = useState([]);
  const [gameName, setGameName] = useState("Unknown Game");
  const [gId, setGId] = useState(null);
  const [supporterId, setSupporterId] = useState(null); // State to track selected player
  const [supporterUserId, setSupporterUserId] = useState(null); // State to track selected player
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if form is submitting

  const { voteForWinner, checkVote,loading } = useVote();
  const { handleUpdateWinner } = useArinaHook();
  const { getWalletAddressById } = useUser();

  const [actionCallBack, setActionCallBack] = useLocalStorage("actionCallBack",null);
  const [isLoading,setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    if (gameData && user) {
      setPlayers(gameData?.team || []);
      setGameName(gameData?.name || "Unknown Game");
      setGId(gameData?.id || null);
      checkVote({ gameId: gameData.id, userId: user.id });
    }
    setIsLoading(false);

  }, [gameData, user, checkVote]);


  useEffect(() => {
    if(gameData?.status == "finished"){
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
          if (transactionHashes && actionCallBack) {
     
            await voteForWinner({
              gameId: actionCallBack.data.gameId,
              voteFor: actionCallBack.data.voteFor,
              transactionHash :transactionHashes
            });

            
          } else {
            console.error("Challenge ID not found in transaction logs.");
            toast({
              variant: "destructive",
              title: "Transaction not found.",
              description: "",
              duration: 2000,
            });
          
            setIsLoading(false);

          }
        } catch (error) {
          console.error("Error during game creation:", error);
          toast({
            variant: "destructive",
            title: "Please select team",
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

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if(supporterId == null && supporterUserId == null){
        toast({
          variant: "destructive",
          title: "Please select the team",
          description: "",
          duration: 2000,
        });
       
      }else{
        const walletAddress = await getWalletAddressById(supporterUserId);
        const data = {
          challengeId: gameData.challengeId,
          participants: [walletAddress],
          voteFor: [supporterId],
          gameId:gameData?.id
        };
  
        await handleUpdateWinner({ data });
      }
     
      setIsLoading(false);

    } catch (error) {
      setErrors({ message: error.message });
      toast({
        variant: "destructive",
        title: "Somthing went wrong",
        description: "",
        duration: 2000,
      });
      setIsLoading(false);

    }
  };

  const handleSelectPlayer = (index, owner) => {
    setSupporterId(index);
    setSupporterUserId(owner);
  };

  return (
    // <div className="min-h-screen bg-gradient-custom px-4 pt-10">
    <div className="min-h-screen px-4 pt-10">

      <div className="md:container">



{isLoading ? (
      <>
      <Loader/>
      </>
    ):(
      <>
    
    
      <div className="md:container md:px-36">
        <div className="flex justify-center md:justify-center my-2">
          <h1 className="text-2xl md:text-4xl font-bold text-newSecondary mb-4">
          Who won?
          </h1>
        </div>

        <div className="mt-3">
          <p className="flex justify-center text-2xl md:text-4xl font-bold text-newSecondary md:text-center">
            {gameName}
          </p>
        </div>

        <div className="flex flex-col md:flex-row w-full items-center justify-between md:justify-center gap-10 md:gap-40 mt-5 md:mt-5">
          {players.length > 0 ? (
            players.map((player, index) => (
              <div
                key={index}
                className={`w-[150px] h-[150px] min-w-[150px] min-h-[150px] bg-black border shadow-md rounded-[25px] p-4 flex flex-col justify-center items-center hover:border hover:border-newSecondary hover:border-4 cursor-pointer
                  ${supporterId === index ? "border-newSecondary border-4" : ""}`}
                onClick={() => handleSelectPlayer(index, player.ownerId)}
              >
                <div className="flex flex-col items-center space-y-2 hover:scale-[1.1]">
                  <div className="w-[100px] h-[100px] bg-gray-300 rounded-lg overflow-hidden">
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

        {errors.message && (
          <div className="text-red-500 text-sm mt-2 text-center">
            {errors.message}
          </div>
        )}

        <div className="pb-4 flex justify-center mt-20">
          <Button
            className="bg-newSecondary hover:bg-orange-600 text-white py-2 px-4 rounded-full w-48 hover:scale-[1.1]"
            onClick={handleConfirm}
            disabled={isSubmitting}
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

export default protectedPage(FinishVote);
