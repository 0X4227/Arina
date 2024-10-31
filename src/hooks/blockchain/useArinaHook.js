import { NearContext } from "@/context";
import { useEffect, useState, useContext } from "react";
import useNumberFormateHook from "../../hooks/utils/useNumberFormateHook";
import {ARINA_CONTRACT, TOKEN_CONTRACT} from "@/constants/veriables";
import useTokenHook from "./useTokenHook";
import { useLocalStorage } from "usehooks-ts";


const useArinaHook = () => {
    const { wallet, signedAccountId } = useContext(NearContext);
    const {formatNumber ,convertNumber,parseNumber} = useNumberFormateHook();
    const arinaContractId = ARINA_CONTRACT;
    const {ftTransferCall} = useTokenHook(TOKEN_CONTRACT); 
    
  const [actionCallBack, setActionCallBack] = useLocalStorage("actionCallBack", null);

    const handleCreateGame = async ({data}) => {
      try {
        let msg = JSON.stringify({
          action: "AddChallengeAndPlaceBet",
          participant: signedAccountId,
          challenge_link: "https://bit.ly/3YvG9gz"
        });
        let actionOfCallBack = {
          hook:"useArinaHook",
          method:"handleCreateGame",
          data:{
          ...data 
          }

        }

        setActionCallBack(actionOfCallBack);

        const result = await ftTransferCall(arinaContractId,data.amount,msg);
        // if(result.success){
          return result;
        // }

      } catch (error) {
        console.error('Transfer call failed:', error);
      }
    };




    const handleAcceptBet = async ({data}) => {
      try {
        let msg = JSON.stringify({
          action: "PlaceBetOnly",
          participant: signedAccountId,
          challenge_id: data.challengeId
        });
        let actionOfCallBack = {
          hook:"useArinaHook",
          method:"handleAcceptBet",
          data:{
          ...data 
          }

        }
        setActionCallBack(actionOfCallBack);

        const result = await ftTransferCall(arinaContractId,data.amount,msg);
        // if(result.success){
          return result;
        // }

      } catch (error) {
        console.error('Transfer call failed:', error);
      }
    };


    const handleAcceptSupporterBet = async ({data}) => {
      try {
        let msg = JSON.stringify({
          action: "PlaceBetOnly",
          participant: data.supporterId,
          challenge_id: data.challengeId
        });
        let actionOfCallBack = {
          hook:"useArinaHook",
          method:"handleAcceptBet",
          data:{
          ...data 
          }

        }
        setActionCallBack(actionOfCallBack);

        const result = await ftTransferCall(arinaContractId,data.amount,msg);
        // if(result.success){
          return result;
        // }

      } catch (error) {
        console.error('Transfer call failed:', error);
      }
    };


    const handleUpdateWinner = async ({data}) => {
      try {
        let actionOfCallBack = {
          hook:"useArinaHook",
          method:"handleUpdateWinner",
          data:{
          ...data 
          }
        }
        setActionCallBack(actionOfCallBack);

        const result = await wallet.callMethod({
          contractId: arinaContractId,  // Replace with your actual contract account ID
          method: 'update_winner_by_challenge',         // Method to call
          args: { challenge_id: data.challengeId, participants:data.participants }, // Arguments for the method
          gas: '30000000000000',                        // Optional: set appropriate gas (default: 30 TeraGas)
          deposit: '0',                                 // No deposit required in yoctoNEAR
        });
    
        // //console.log('Winner update successful:', result);
      } catch (error) {
        console.error('Winner update failed:', error);
      }
    };



    const [calculateTotalWinning, setCalculateTotalWinning] = useState([]); // State to store the calculated total winnings array

   
    const handleCalculateWinner = async ({challangeId}) => {
      try {
          const result = await wallet.viewMethod({
          contractId: arinaContractId,  // Replace with your actual contract account ID
          method: 'calculate_winnings',         // Method to call
          args: { challenge_id: challangeId, rank:1 }, // Arguments for the method                             // No deposit required in yoctoNEAR
        });

        const processedResults = result.map((item) => ({
          accountName: item[0], // Assign account name from the first element
          amount:formatNumber(convertNumber(item[1].toString(), 8) , 2)
        }));

        setCalculateTotalWinning(processedResults); // Update state with the fetched array result
    
        // //console.log('Winner update successful:', result);
      } catch (error) {
        console.error('Winner update failed:', error);
      }
    };



    const handleClaimWinnings = async ({data}) => {
      try {
        let rank = 1;
    
        let actionOfCallBack = {
          hook:"useArinaHook",
          method:"handleClaimWinnings",
          data:{
          ...data 
          }
        }
        setActionCallBack(actionOfCallBack);

        const result = await wallet.callMethod({
          contractId: arinaContractId,  // Replace with your contract account ID
          method: 'claim_winnings',                    // Method to call
          args: { challenge_id: data.challengeId, rank },   // Arguments for the method
          gas: '30000000000000',                       // Optional: gas limit (default: 30 TeraGas)
          deposit: '0',                                // Optional: deposit amount in yoctoNEAR, if any
        });
    
        // //console.log('Claim winnings successful:', result);
      } catch (error) {
        // console.error('Claim winnings failed:', error);
      }
    };
  



    const [winners, setWinners] = useState([]); // State to store the winners and their positions



    const handleGetWinnersAndPositions = async ({challangeId}) => {
      try {
      
        const result = await wallet.viewMethod({
          contractId: arinaContractId, // Replace with your contract account ID
          method: 'get_winners_and_positions_by_challenge', // Method to call
          args: { challenge_id: challangeId }, // Arguments for the method
        });

       //console.log('Winners and positions fetched:', result);
        // Convert result to a list of objects with account name and position
        const winnersList = Object.entries(result).map(([account, position]) => ({
          account,
          position,
        }));
  
        setWinners(winnersList); // Update state with the fetched result
      } catch (error) {
        console.error('Failed to fetch winners and positions:', error);
        
      }
    };


    const [bettingAmounts, setBettingAmounts] = useState([]); // State to store the fetched betting amounts as a list

    const handleViewBettingAmounts = async ({challangeId}) => {
      try {
   
        const result = await wallet.viewMethod({
          contractId: arinaContractId,  // Replace with your contract account ID
          method: 'get_all_betting_amounts_by_challenge', // Method to call
          args: { challenge_id: challangeId },           // Arguments for the method
        });
    
        //console.log('Betting amounts fetched:', result);
        // Convert result to a list of objects with account name and amount
        const amountsList = Object.entries(result).map(([account, amount]) => ({
          account,
          amount:formatNumber(convertNumber(amount.toString(), 8) , 2)
        }));
  
        setBettingAmounts(amountsList);
      } catch (error) {
        console.error('Failed to fetch winners and positions:', error);
        
      }
    };


 
    
  

    return {
      handleCreateGame,
      handleAcceptBet,
      handleUpdateWinner,
      winners,
      handleGetWinnersAndPositions,
      handleViewBettingAmounts,
      bettingAmounts,
      handleCalculateWinner,
      calculateTotalWinning,
      handleClaimWinnings,
      handleAcceptSupporterBet
    };
};

export default useArinaHook;