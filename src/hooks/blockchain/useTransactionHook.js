import { NearContext } from "@/context";
import { useEffect, useState, useContext } from "react";
import useNumberFormateHook from "../../hooks/utils/useNumberFormateHook";
import { TOKEN_CONTRACT } from "@/constants/veriables";
import useTokenHook from "./useTokenHook";
import { connect } from "near-api-js";

const useTransactionHook = () => {
  const { wallet, signedAccountId } = useContext(NearContext);
  const { formatNumber, convertNumber } = useNumberFormateHook();
  const [challengeId, setChallengeId] = useState(null);

  const { accountId } = useTokenHook(TOKEN_CONTRACT);

  const getTransactionDetail = async (transactionHash) => {
    // Connect to the NEAR blockchain
    const near = await connect({
      networkId: "testnet", // or "testnet" depending on your environment
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.near.org",
      explorerUrl: "https://testnet.nearblocks.io",
    });

    // Get the transaction outcome by transaction hash and account ID
    const result = await near.connection.provider.txStatus(transactionHash, accountId);

    let extractedChallengeId = null;

    try {
     
      let response = {
        transactionHash:transactionHash,
        log:result.receipts_outcome,
        isSuccess:true
      }
      return response;
      // if (logObject.type === "ChallengeAdded" || logObject.type === "BetOnly") {
      //   //console.log("Challenge ID:", logObject.params.challenge_id);
      //   extractedChallengeId = logObject.params.challenge_id;
      //   setChallengeId(extractedChallengeId); // Update state
      // }
    } catch (e) {
      // Handle non-JSON logs if necessary
      console.error("e Log:", e);
      let response = {
        transactionHash:transactionHash,
        isSuccess:false,
        error:e
      }
        return response;
    }
    // Loop through the logs in the transaction receipts
    // result.receipts_outcome.forEach((outcome) => {
    //   outcome.outcome.logs.forEach((log) => {
    //     //console.log("Log:", log);
    //     // Optionally parse the JSON log to extract challenge_id
    //     try {
    //       const logObject = JSON.parse(log);

    //       let response = {
    //         transactionHash:transactionHash,
    //         log:log,
    //         isSuccess:true
    //       }
    //       return response;
    //       // if (logObject.type === "ChallengeAdded" || logObject.type === "BetOnly") {
    //       //   //console.log("Challenge ID:", logObject.params.challenge_id);
    //       //   extractedChallengeId = logObject.params.challenge_id;
    //       //   setChallengeId(extractedChallengeId); // Update state
    //       // }
    //     } catch (e) {
    //       // Handle non-JSON logs if necessary
    //       console.error("Non-JSON Log:", log);
    //       let response = {
    //         transactionHash:transactionHash,
    //         log:log,
    //         isSuccess:false
    //       }
          
    //     }
    //   });
    // });

    // // Return the extracted challenge ID
    // return extractedChallengeId;
  };

  return {
    getTransactionDetail,
    challengeId,
  };
};

export default useTransactionHook;

