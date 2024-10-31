import Marquee from "@/wireframes/components/marquee";
import { NearContext } from "@/context";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";
import Active_challenges from "@/pages/user/dashboardSection/active_challenges";
import useFetchActiveGames from "@/hooks/firebase/useFetchActiveGames";
import useFetchFinishGames from "@/hooks/firebase/useFetchFinishGames";
import protectedPage from "@/utils/protectedRoute";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

function Home() {
  const [isActiveChallenge, setIsActiveChallenge] = useState(false);
  const [redirectUrl, setRedirectUrl] = useLocalStorage("redirectUrl", null);
  const { activeGames } = useFetchActiveGames();
  // const { pastGames } = useFetchFinishGames();
  const router = useRouter();
  const { wallet } = useContext(NearContext);
  // const [isActiveSelected, setIsActiveSelected] = useLocalStorage("gameStatus", true);
  const [isLoading, setIsLoading] = useState(false);
  const { transactionHashes } = router.query;
  const [gameDetail, setGameDetail] = useLocalStorage("gameDetail",activeGames);
  const { toast } = useToast();

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]);

  useEffect(() => {
    setIsLoading(true);
    setGameDetail(activeGames);
    setIsLoading(false);

  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (activeGames?.length) {
      setIsActiveChallenge(true);
      // setGameDetail(isActiveSelected ? activeGames : pastGames);
      setGameDetail(activeGames);
      setIsLoading(false);

    }
    setIsLoading(false);

  }, [activeGames]);

  // const toggleActivePast = (state) => {
  //   setIsActiveSelected(state);
  // };

  const plugin = useRef(
    Autoplay({ delay: 9000, stopOnInteraction: true })
  );

  const ReviewCard = ({ activeGameDetail }) => {
    return (
      <Active_challenges
        activeGameDetail={activeGameDetail}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        transactionHashes={transactionHashes}
      />
    );
  };

  return (
    <div className="min-h-screen px-4 pt-10">
      <div className="flex-grow md:container pb-20">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {isActiveChallenge ? (
              <div>
               

               <div className="w-full container">   
      <Carousel
                  className="w-full max-w-full"
                  plugins={[plugin.current]}
                  onMouseEnter={plugin.current.stop}
                  onMouseLeave={plugin.current.reset}
                >
      <CarouselContent className="-ml-1">
        {gameDetail.map((game, index) => (
                    <CarouselItem key={index}  className={`pl-1 ${gameDetail.length === 1 ? 'basis-full' : 'md:basis-1/2 lg:basis-1/3'}`}>

            <div>
              <Active_challenges
                activeGameDetail={game}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-transparent hover:bg-transparent text-black" />
      <CarouselNext className="bg-transparent hover:bg-transparent text-black" />
  
    </Carousel>
    </div>
               
                {/* <Marquee pauseOnHover className="[--duration:40s]">
                  {gameDetail?.map((game, index) => (
                    <ReviewCard activeGameDetail={game} key={game.username} />
                  ))}
                </Marquee> */}
              </div>
            ) : (
              <div className="text-center my-20">
                <p className="text-lg text-newSecondary mb-8 md:text-[32px] md:leading-10">
                  Start a challenge to compete with friends!
                </p>
              </div>
            )}
            
            <div className="w-full fixed bottom-0 left-0">
              <div className="flex justify-center py-4">
                <Header isHome={false} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default protectedPage(Home);
