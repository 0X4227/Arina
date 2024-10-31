import { NearContext } from "@/context";
import { useEffect, useState, useContext } from "react";
import useNumberFormateHook from "@/hooks/utils/useNumberFormateHook";
import { ARINA_CONTRACT, TOKEN_CONTRACT } from "@/constants/veriables";

const useTokenHook = (tokenContract) => {
    const [userBalance, setUserBalance] = useState(0);
    const { wallet, signedAccountId } = useContext(NearContext);
    const {formatNumber ,convertNumber,parseNumber} = useNumberFormateHook();
    // const tokenContract = TOKEN_CONTRACT;
    const getTokenBalance = async (accountId) => {
      if(!accountId){
        throw "account not define"
      }
        try {
            const balance = await wallet.viewMethod({
                contractId: tokenContract,  // Use dynamic token contract ID
                method: 'ft_balance_of',     // Method to call
                args: { account_id: accountId }, // Use the provided accountId or signedAccountId
            });
            return formatNumber(convertNumber(balance, 8) , 2); // Return the balance value
        } catch (error) {
            console.error('Failed to retrieve balance:', error);
        }
    };

    const ftTransferCall = async (receiverId,amount,msg) => {
      if(!receiverId){
        throw "receiverId not define"
      }
        try {
            const blockChainAmount = parseNumber(amount,8);
            const result = await wallet.callMethod({
                contractId: tokenContract,  // Use dynamic token contract ID
                method: 'ft_transfer_call',          // Method to call
                args: { receiver_id: receiverId, amount:blockChainAmount, msg }, // Arguments for the method
                gas: '300000000000000',              // Gas limit (300 TeraGas)
                deposit: '1',           // Use the provided accountId or signedAccountId
            });
            return result; // Return the value
        } catch (error) {
            console.error('Failed to retrieve balance:', error);
        }
    };


    useEffect(() => {
      const fetchBalance = async () => {
          if (signedAccountId) {
              const balance = await getTokenBalance(signedAccountId); // Fetch balance
              setUserBalance(balance); // Update state with the balance
          }
      };

      fetchBalance(); // Call the inner async function
  }, [signedAccountId]);

    return {
        accountId: signedAccountId,
        userBalance,
        getTokenBalance,
        ftTransferCall
    };
};

export default useTokenHook;