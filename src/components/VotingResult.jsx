import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useArinaHook from "../hooks/blockchain/useArinaHook";
import { useEffect } from "react";

export function VotingResult({ onClick,challangeId}) {
  const {winners,handleGetWinnersAndPositions} = useArinaHook();
  useEffect(()=>{
    handleGetWinnersAndPositions({challangeId});
  },[])


  const handleVotingResultView = async () => {
    handleGetWinnersAndPositions({challangeId});



  };

  useEffect(()=>{},[winners])

  return (
    <Dialog>
      <DialogTrigger>
      <div
          className="bg-transparent text-white w-full min-w-full hover:scale-[1.1]"
          onClick={handleVotingResultView}
        >
           Voting
        </div>
     
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-white text-[32px] bg-[#111922] shadow-md ">
        <DialogHeader>
          <DialogTitle className="text-newSecondary rounded-full">
            Voting result
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Table for displaying wallet address and rank */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">
                    User Name
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Number of Vote
                  </th>
                </tr>
              </thead>
              <tbody>
                {winners && winners.length > 0 ? (
                  winners.map((item, index) => (
                    <tr
                      key={item.account}
                      className="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">{item.account}</td>
                      <td className="px-4 py-2">{item.position}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-4 py-2 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
         
         
        </div>
      
      </DialogContent>
    </Dialog>
  );
}
