import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SHARE_LINK_URL } from "@/constants/collections";
import { useLocalStorage } from "usehooks-ts";

function WaitOpponent(props) {
  const [gameDetail, setGameDetail] = useLocalStorage("gameDetail", null);
  const [link, setLink] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [gameName, setGameName] = useState(null);
  const [gameId, setGameId] = useState(props?.activeGameDetail?.id);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    if (gameDetail) {
      setPlayer1(gameDetail?.gameData?.team[0]?.teamName || null);
      setGameName(gameDetail?.gameData?.name || null);
      setGameId(gameDetail?.contributionTransaction?.gameId || null);
      setAmount(gameDetail?.contributionTransaction?.amount);
      setLink(`${SHARE_LINK_URL}user/join_game?gameId=${gameId}`);
    }
  }, [gameDetail]);

  useEffect(() => {
    if (props?.activeGameDetail) {
      setPlayer1(props?.activeGameDetail?.team[0]?.teamName || null);
      setGameName(props?.activeGameDetail?.name || null);
      setGameId(props?.activeGameDetail?.id || null);
      setAmount(props?.activeGameDetail?.totalContribution);
      setLink(`${SHARE_LINK_URL}user/join_game?gameId=${gameId}`);
      setGameDetail(null);
    }
  }, [props?.activeGameDetail]);

  //console.log("props?.activeGameDetail", props?.activeGameDetail);
  const handleShareLink = () => {
    const linkUrl = `${SHARE_LINK_URL}user/join_game?gameId=${gameId}`;
    // setLink(linkUrl);
    if (navigator.share) {
      navigator
        .share({
          title: "New Challenge",
          text: `Check out this challenge for ${gameName}`,
          url: linkUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      //console.log("Sharing not supported on this browser.");
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-center my-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tertiary mb-4 text-center">
          {props.title ? <>{props.title}</> : <>Competition created!</>}
        </h1>
      </div>

      <div className="md:flex md:justify-center">
        <div className="w-full bg-tertiary shadow-md max-w-[600px] md:min-w-[356px] rounded-[25px] px-4 py-6 flex flex-col justify-between items-center mt-6 space-y-4 relative">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-[70px] h-[70px] bg-gray-300 rounded-lg overflow-hidden">
                <img
                  src="/user.png"
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-[13px] text-newSecondary font-bold">
                {player1}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center mx-4 text-center space-y-2">
              <p className="text-[18px] sm:text-[24px] font-bold text-white">
                {gameName}
              </p>
              <p className="text-[24px] sm:text-[36px] font-bold text-newSecondary">
                {amount}$
              </p>
            </div>

            <div className="flex items-center justify-center flex-col space-y-2">
              <svg
                width="30"
                height="50"
                viewBox="0 0 43 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.25 41L24.375 5V29H38.75L18.625 65V41H4.25Z"
                  stroke="#0356CC"
                  strokeWidth="8.33333"
                  strokeLinejoin="round"
                />
              </svg>

              {link && (
                <p className="text-[13px] text-newSecondary break-words text-center max-w-[120px] sm:max-w-[180px]">
                  {link}
                </p>
              )}

              <Button
                onClick={handleShareLink}
                className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full text-[13px] sm:text-[15px] hover:scale-[1.1]"
              >
                Share Invitation
              </Button>
            </div>
          </div>

          <div className="w-full flex justify-center mt-4">
            <Button
              // onClick={}
              className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-6 rounded-full text-[13px] sm:text-[15px] hover:scale-[1.1] transition-transform"
            >
              Bet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitOpponent;
