import { useEffect, useState } from "react";
import protectedPage from "@/utils/protectedRoute";
import { Button } from "@/components/ui/button"; // Assuming ShadCN's button component is used
import { Input } from "@/components/ui/input"; // Assuming you have a custom Input component with ShadCN
import useCreateGame from "@/hooks/firebase/useCreateGame";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";
import useArinaHook from "@/hooks/blockchain/useArinaHook";
import useTransactionHook from "@/hooks/blockchain/useTransactionHook";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

function CreateGame() {
    const [gameName, setGameName] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState({});
    const { handleCreateGame } = useArinaHook();
    const {
        createGame,
        error,
        isGameCreated,
        loading,
    } = useCreateGame();
    const router = useRouter();
    const { transactionHashes } = router.query;
    const [actionCallBack, setActionCallBack] = useLocalStorage("actionCallBack", null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getTransactionDetail } = useTransactionHook();
    const [user, setUser] = useLocalStorage("user", null);
    const [teamName, setTeamName] = useState(user?.walletAddress?.replace(/\.near|\.testnet$/, ""));
    const [isLoading , setIsLoading] = useState(false);
    // Handle transaction processing on mount
    const { toast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        const processTransaction = async () => {
            if (transactionHashes && actionCallBack && !isSubmitting) {
                setIsSubmitting(true);
                try {
                    const transaction = await getTransactionDetail(transactionHashes);
                    let extractedChallengeId = null;

                    // Iterate over the transaction logs
                    for (const outcome of transaction?.log || []) {
                        for (const log of outcome.outcome.logs) {
                            //console.log("Log:", log);
                            try {
                                const logObject = JSON.parse(log);
                                if (logObject.type === "ChallengeAdded") {
                                    extractedChallengeId = logObject.params.challenge_id;
                                    break; // Exit loop once found
                                }
                            } catch (e) {
                                console.error("Non-JSON Log:", log);
                            }
                        }
                        if (extractedChallengeId) break; // Exit outer loop if found
                    }

                    if (extractedChallengeId) {
                        await createGame({
                            gameName: actionCallBack.data.gameName,
                            teamName: actionCallBack.data.teamName,
                            amount: actionCallBack.data.amount,
                            transactionHashes,
                            challengeId: extractedChallengeId,
                        });
                        setActionCallBack(null);
        setIsLoading(false);

                        router.push("/user");
                    } else {
                        
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
                        title: "Error during game creation:",
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
    }, [transactionHashes, actionCallBack, getTransactionDetail, createGame, setActionCallBack, isSubmitting]);

    const handleSubmit = async (e) => {
        setIsLoading(true);

        e.preventDefault();
        setErrors({}); // Reset errors

        // Validation checks
        const validationErrors = {};
        if (!gameName) validationErrors.gameName = "Please enter a game name.";
        if (!amount) validationErrors.amount = "Please enter an amount.";
        else if (isNaN(amount) || amount <= 0) validationErrors.amount = "Amount must be a positive number.";
        if (!teamName) validationErrors.teamName = "Please enter a team name.";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        setIsLoading(false);

            return; // Stop if validation fails
        }

        // Handle token interaction
        try {
            const result = await handleCreateGame({ data: { gameName, teamName, amount } });
        setIsLoading(false);

        toast({
            title: "Token operation result:",
            description: "",
            duration: 2000,
          });
          
        } catch (error) {
            console.error("Error in game creation:", error);
            toast({
                variant: "destructive",
                title: "Something went wrong while creating the game.",
                description: "",
                duration: 2000,
              });
              
        setIsLoading(false);

        }
    };

    return (
        // <div className="min-h-screen bg-gradient-custom px-4 md:px-10 pt-10">
        <div className="min-h-screen  px-4 md:px-10 pt-10">

      <div className="md:container">

            {loading || isLoading || isSubmitting ? (
                <Loader />
            ) : (
                <>
           

                    {/* Form */}
                    <div className="flex items-center justify-center pt-10">
                        <form onSubmit={handleSubmit} className="w-full max-w-sm">
                            <h1 className="text-2xl font-bold text-newSecondary mb-4 mt-5">What game are you playing?</h1>

                            {/* Game Name Input */}
                            <Input
                                type="text"
                                value={gameName}
                                onChange={(e) => setGameName(e.target.value)}
                                placeholder="Name of game"
                                className="w-full px-4 py-2 border-b-2 border-blue-500 bg-white text-black placeholder-white focus:outline-none focus:border-blue-400"
                            />
                            {errors.gameName && <p className="text-red-500 text-sm mt-2">{errors.gameName}</p>}

                            {/* Amount Input */}
                            <h1 className="text-2xl font-bold text-newSecondary mb-4 mt-5">What is your wager?</h1>
                            <Input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="$"
                                className="w-full px-4 py-2 border-b-2 border-blue-500 bg-white text-black placeholder-blue-300 focus:outline-none focus:border-blue-400"
                            />
                            {errors.amount && <p className="text-red-500 text-sm mt-2">{errors.amount}</p>}

                            {/* Submit Button */}
                            <div className="pb-4 flex justify-center mt-5">
                                <Button
                                    type="submit"
                                    className={`bg-newSecondary hover:bg-orange-600 text-white py-2 px-4 rounded-full w-48 ${isSubmitting ? "cursor-not-allowed" : ""}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="w-full fixed bottom-0 left-0">
    <div className="flex justify-center py-4">
     


<Header />


    </div>
  </div>
                </>
            )}
        </div>
        </div>

    );
}

export default protectedPage(CreateGame);
