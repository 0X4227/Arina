import { Button } from "@/components/ui/button"; // Assuming shadcn's button component is used
import { NearContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { useCheckUser } from "@/hooks/firebase/useCheckUser";
import unProtectedPage from "@/utils/unProtectedRoute";
import Loader from "@/components/Loader";
import { useLocalStorage } from "usehooks-ts";

function Home() {
  const { signedAccountId, wallet } = useContext(NearContext);
  const { checkUser } = useCheckUser(signedAccountId);
  const [isLoading,setIsLoading]=useState(true);
  const [user,setUser] = useLocalStorage("user",null);

  useEffect(() => {
    setIsLoading(true);
    if (signedAccountId && user && user.exist) {  
      checkUser(); // Automatically check the user in Firestore
    setIsLoading(false);

    }
    setIsLoading(false);

  }, [signedAccountId, checkUser]);

  const handleButtonClick = async () => {
    setIsLoading(true);

    if (!signedAccountId) {
      // If no user is signed in, trigger wallet sign-in
      await wallet.signIn();
    setIsLoading(false);

    }
    setIsLoading(false);

  };

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gradient-custom">
    <div className="flex items-center justify-center min-h-screen">

      {isLoading ? (<Loader/>) : (
        <>
          <div className="text-center">
        <div className="flex justify-center mb-4">
          <img src="/arina-logo.png" alt="Logo" className="h-10" />
        </div>
        {/* <h1 className="text-5xl text-newSecondary mb-8">Arina</h1> */}
        <p className="text-lg text-newSecondary mt-4">Friendly Competitions</p>
        <p className="text-lg text-newSecondary mb-8">With Skin in the Game</p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <Button
            onClick={handleButtonClick}
            className="bg-newSecondary hover:bg-orange-600 text-white py-2 px-4 rounded-full w-48 hover:scale-[1.1]"
          >
            Sign Up
          </Button>
          <Button
            onClick={handleButtonClick}
            className="bg-newSecondary hover:bg-orange-600 text-white py-2 px-4 rounded-full w-48 hover:scale-[1.1]"
          >
            Log In
          </Button>
        </div>
      </div>
        </>
      )}
    
    </div>
  );
}

export default unProtectedPage(Home);
