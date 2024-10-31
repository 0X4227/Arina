
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useArinaHook from "../hooks/blockchain/useArinaHook";
import { useEffect } from "react";

export function WinnerAmount({ onClick,challangeId}) {
  
  const { handleCalculateWinner,
    calculateTotalWinning} = useArinaHook();
  useEffect(()=>{
    handleCalculateWinner({challangeId});
  },[])


  const handleWinnerAmountView = async () => {
    handleCalculateWinner({challangeId});


  };

  useEffect(()=>{},[calculateTotalWinning])

 
  return (
    <Dialog>
      <DialogTrigger>

      <div
          className="bg-transparent text-white  w-full min-w-full hover:scale-[1.1]"
          onClick={handleWinnerAmountView}

        >
          Result
            
        </div>
    
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-dark text-[32px] bg-[#111922] shadow-md ">
        <DialogHeader>
          <DialogTitle className="text-newSecondary rounded-full">
            Winner result
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Table for displaying wallet address and rank */}
          <div className="overflow-x-auto">
           
            {calculateTotalWinning.length > 0 ? (
  <table className="w-full text-left text-sm text-white">
    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
      <tr>
        <th scope="col" className="px-4 py-2">User Name</th>
        <th scope="col" className="px-4 py-2">Winning Amount</th>
      </tr>
    </thead>
    <tbody>
      {calculateTotalWinning.map((item, index) => (
        <tr
          key={index}
          className="bg-transparent border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td className="px-4 py-2">{item.accountName}</td>
          <td className="px-4 py-2">{item.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="px-4 py-2 text-center text-white">No data available</p>
)}

          </div>
         
         
        </div>
      
      </DialogContent>
    </Dialog>
  );
}
