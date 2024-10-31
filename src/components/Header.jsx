import * as React from "react";
import { GrTransaction } from "react-icons/gr";
import { RiHome2Fill, RiLogoutCircleRLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import EditProfile from "@/components/EditProfile";
import { useLocalStorage } from "usehooks-ts";
import useTokenHook from "@/hooks/blockchain/useTokenHook";
import { TOKEN_CONTRACT } from "@/constants/veriables";
import { NearContext } from "@/context";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils"; // Utility function from shadcn for class name merging

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaExchangeAlt, FaQuestionCircle } from "react-icons/fa";
import Link from "next/link";

const Header = (props) => {
  const { accountId, userBalance } = useTokenHook(TOKEN_CONTRACT);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const [user] = useLocalStorage("user");
  const { wallet } = React.useContext(NearContext);
  // const [isActiveSelected, setIsActiveSelected] = useLocalStorage("gameStatus",true); // State for toggle

  const handleTransactionsBtnClick = () => {
    router.push("/user/transactions");
  };

  // const toggleActivePast = (state) => {
  //   setIsActiveSelected(state);
  // };
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await wallet.signOut();
      localStorage.clear();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHome = () => {
    localStorage.removeItem("redirectUrl");
    router.push(accountId ? "/user/" : "/");
  };

  const handleCreateGame = async () => {
    setIsLoading(true);
    router.push("/user/create_game");
  };

  return (
    <>
      <div className="flex items-center border rounded-lg overflow-hidden shadow-md w-full max-w-md  h-[70px] bg-[#E5E5E5] border-black">
        {/* Thumbnail */}
        <div className="w-1/6 p-2 md:w-1/6 sm:w-full">
          <div className="relative flex-shrink-0 w-[60px] h-[60px] sm:w-[60px] sm:h-[60px] md:w-[60px] md:h-[60px]  rounded-lg overflow-hidden">
            {accountId ? (
              <>
                <img
                  src={user?.profileImage || "/unsplash.png"}
                  alt="Profile"
                  className="object-cover w-full h-[60px] rounded"
                />
                <div className="absolute top-1 right-1 w-6 h-6 bg-transparent flex items-center justify-center">
                  <EditProfile accountId={accountId} />
                </div>
              </>
            ) : (
              <img
                src="/unsplash.png"
                alt="Product thumbnail"
                className="w-full h-[60px] rounded"
              />
            )}
          </div>
        </div>

        {/* Title and Price */}
        <div className="flex flex-col p-2 justify-center w-1/4">
          {accountId ? (
            <>
              <span className="text-gray-800 text-[12px] font-bold truncate">
                {user?.walletAddress?.replace(/\.near|\.testnet$/, "")}
              </span>
              <span className="text-black text-[12px] font-bold">
                $ {parseFloat(userBalance).toFixed(2)}{" "}
              </span>
            </>
          ) : (
            <>
              <span className="text-gray-800 text-[12px]  font-bold truncate">
                Guest
              </span>
              <span className="text-black text-[12px]  font-bold">$ 0 </span>
            </>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center justify-center w-1/3 gap-3 text-black">
          <div className="md:mt-0 flex flex-row items-center gap-2">
            {props.isHome == false ? (
              <></>
            ) : (
              <>
                <Button
                  onClick={handleHome}
                  className="w-2 h-6 md:w-6 md:h-6 px-3 flex items-center justify-center bg-transparent hover:scale-[1.1]"
                >
                  <p>
                    <RiHome2Fill className="text-[16px] md:text-[24px] text-black hover:scale-[1.1]" />
                  </p>
                </Button>
              </>
            )}

            {accountId && (
              <>
                <Button
                  onClick={handleTransactionsBtnClick}
                  className="w-2 h-6 md:w-6 md:h-6 px-3 flex items-center justify-center bg-transparent hover:scale-[1.1]"
                  disabled={!accountId} // Disable if accountId is falsy
                >
                  <p>
                    <GrTransaction className="text-[16px] md:text-[24px] text-black hover:scale-[1.1]" />
                  </p>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-2 h-6 md:w-6 md:h-6 px-3 flex items-center justify-center bg-transparent hover:scale-[1.1]"
                      disabled={!accountId} // Disable if accountId is falsy
                    >
                      <p>
                        <RiLogoutCircleRLine className="text-[16px] md:text-[24px] text-black hover:scale-[1.1]" />
                      </p>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#111922] shadow-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white shadow-md">
                        Log Out
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log out? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <div className="gap-3 flex justify-end items-center">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-newSecondary"
                          onClick={handleSignOut}
                        >
                          Log Out
                        </AlertDialogAction>
                      </div>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="w-1/3 p-1">
          <>
            <Button
              onClick={handleCreateGame}
              disabled={!accountId} // Disable if accountId is falsy
              className="bg-[#E44545] text-white font-semibold py-4 w-full rounded text-[10px]"
            >
              CHALLENGE
            </Button>
          </>
        </div>
      </div>
    </>
  );
};

export default Header;
