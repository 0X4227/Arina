import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useFinishGame from "@/hooks/firebase/useFinishGame";
import { useRouter } from "next/router";

export function FinishGameModal({ onClick, gameId }) {
  const { finishGameStatus } = useFinishGame();
  const router = useRouter();
  

  const handleCancel = () => {
    window.location.href = "";
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="bg-transparent text-white  w-full min-w-full hover:scale-[1.1]"
        
          >
          Finish
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-white text-[32px] bg-[#111922] shadow-md ">
        <DialogHeader>
          <DialogTitle className="text-white rounded-full">
          Finish Game
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Are you sure want to finish the game?
        </DialogDescription>
        <DialogFooter className="flex justify-end items-center gap-3">
          <Button
            className="w-1/4 bg-white hover:bg-orange-600 text-dark py-2 px-4 rounded-full hover:scale-[1.1]"
            onClick={handleCancel}
          >
            No
          </Button>
          <Button
            className="w-1/4 bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full hover:scale-[1.1]"
            onClick={onClick}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
