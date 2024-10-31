import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useArinaHook from "@/hooks/blockchain/useArinaHook";
import { useEffect } from "react";


export function BetingResult({ onClick,challangeId}) {

  const {bettingAmounts,handleViewBettingAmounts} = useArinaHook();

  useEffect(()=>{
    handleViewBettingAmounts({challangeId});
  },[])

  useEffect(()=>{},[bettingAmounts])

  const handleBettingView = async () => {
    handleViewBettingAmounts({challangeId});

  };
 

  return (
    <Dialog>
      <DialogTrigger>
      <p onClick={handleBettingView} className="text-[15px] md:text-[15px] text-white cursor-pointer hover:scale-[1.1]">View Betting History</p>

      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-white text-[32px] bg-[#111922] shadow-md ">
        <DialogHeader>
          <DialogTitle className="text-newSecondary rounded-full">
          Betting History
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Table for displaying wallet address and rank */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-2">
                  User Name
                  </th>
                  <th scope="col" className="px-4 py-2">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bettingAmounts && bettingAmounts.length > 0 ? (
                  bettingAmounts.map((item, index) => (
                    <tr
                      key={item.account}
                      className="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">{item.account}</td>
                      <td className="px-4 py-2">{item.amount}</td>
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
