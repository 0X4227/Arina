import unProtectedPage from "@/utils/unProtectedRoute";
import { useRouter } from "next/router";
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import Header from "@/components/Header";
function JoinGame() {
  const router = useRouter();

  const { gameId } = router.query;
  const { wallet } = useContext(NearContext);
  const [isConnected, setIsConnected] = useState(false);

  const [redirectUrl, setRedirectUrl] = useLocalStorage("redirectUrl", "");

  useEffect(() => {
    try {
      setIsConnected(wallet && wallet.isSignedIn());
    } catch (error) {
      console.error("Error checking wallet connection:", error);
      setIsConnected(false);
    }
  }, [wallet]);

  const handleSupporterClick = () => {
    const supporterUrl = `/user/guess_winner?gameId=` + gameId;
    if (isConnected) {
      router.push(supporterUrl);
    } else {
      setRedirectUrl(supporterUrl); // Store the URL in local storage
      router.push(supporterUrl);
    }
  };

  const handleBack = () => {
      localStorage.removeItem('redirectUrl');
      router.push("/user/");
  };
  
  const handlePlayerClick = () => {
    const playerUrl = `/user/join_challenge?gameId=` + gameId;
    if (isConnected) {
      router.push(playerUrl);
    } else {
      setRedirectUrl(playerUrl); // Store the URL in local storage
      router.push(playerUrl);
    }
  };

  

  return (
    // <div className="min-h-screen bg-gradient-custom px-4 pt-10">
    <div className="min-h-screen px-4 pt-10">

      <div className="md:container">

      <div className="md:container md:px-36">
        <div className="flex md:justify-center my-2">
          <h1 className="text-2xl md:text-4xl font-bold text-newSecondary mb-4">
            You want to be a{" "}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row w-full items-center justify-between md:justify-center gap-10 md:gap-40 mt-10 md:mt-20">
          <div className="w-[151px] h-[161px] min-w-[151px] min-h-[161px] bg-black shadow-md border rounded-[25px] p-4 flex flex-col justify-center items-center hover:border hover:border-newSecondary hover:border-4">
            <div
              className="flex flex-col items-center space-y-2 hover:scale-[1.1]"
              onClick={handleSupporterClick}
              cursor="pointer"
            >
              <div className="w-[90px] h-[90px] bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src="/supporter.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-[13px] text-newSecondary font-bold">
                Supporter
              </p>
            </div>
          </div>
          <div className="w-[151px] h-[161px] min-w-[151px] min-h-[161px]  bg-black shadow-md border rounded-[25px] p-4 flex flex-col justify-center items-center hover:border hover:border-newSecondary hover:border-4">
            <div
              className="flex flex-col items-center space-y-2 hover:scale-[1.1]"
              onClick={handlePlayerClick}
            >
              <div className="w-[90px] h-[90px] bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src="/player.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-[13px] text-newSecondary font-bold">Player</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full fixed bottom-0 left-0">
    <div className="flex justify-center py-4">
     


<Header />


    </div>
  </div>
    </div>
    </div>
  );
}
export default unProtectedPage(JoinGame);
