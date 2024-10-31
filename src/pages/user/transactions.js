import protectedPage from "@/utils/protectedRoute";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGameHistory from "@/hooks/firebase/useGameHistory";
import { useLocalStorage } from "usehooks-ts";
import Loader from "@/components/Loader";
import { VotingResult } from "@/components/VotingResult";
import { BetingResult } from "@/components/BetingResult";
import { WinnerAmount } from "@/components/WinnerAmount";
import Header from "@/components/Header";

function Transactions() {
  const [user] = useLocalStorage("user");
  const { gameHistory, loading, error } = useGameHistory(user?.id);

  // Helper function to format UNIX timestamp into a readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    // <div className="min-h-screen bg-gradient-custom px-4 py-10">
    <div className="min-h-screen px-4 py-10">

      <div className="md:container">

      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>

          <div className="md:container">
            <div className="flex md:justify-center my-2">
              <h1 className="text-2xl md:text-4xl font-bold text-tertiary mb-4">
                Transactions
              </h1>
            </div>

            {loading ? (
              <p className="text-center text-white">Loading game history...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="overflow-y-auto min-h-96 max-h-[500px] border border-gray-300 rounded-lg pb-4 pt-2">
                <Table className="bg-black">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[100px] text-newSecondary font-bold">
                        Sr. No.
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Game Name
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Team 1
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Team 2
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        My Betting Amount
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Beting list
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Vote Counting
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Winning Price
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Winning Amount Status
                      </TableHead>
                      <TableHead className="text-newSecondary font-bold text-left md:text-center">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameHistory.length > 0 ? (
                      gameHistory.map((data, index) => (
                        <TableRow key={index} className="hover:bg-black">
                          <TableCell className="font-medium text-white hover:text-black">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            {data.gameData.name}
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            {data.gameData.team[0]?.teamName || "N/A"}
                          </TableCell>
                          <TableCell className="text-center md:text-center text-white hover:text-black">
                            {data.gameData.team[1]?.teamName || "N/A"}
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            {data.amount}{" "}
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            <BetingResult
                              challangeId={data?.gameData?.challengeId}
                            />
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            <VotingResult
                              challangeId={data?.gameData?.challengeId}
                            />
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            <WinnerAmount
                              challangeId={data?.gameData?.challengeId}
                            />
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            {data.gameData.status.charAt(0).toUpperCase() +
                              data.gameData.status.slice(1)}
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            {data?.gameData?.status === "finished"
                              ? "Claimed"
                              : "Pending"}
                          </TableCell>
                          <TableCell className="text-left md:text-center text-white hover:text-black">
                            {formatDate(data.gameData.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-white hover:text-black"
                        >
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
           <div className="w-full fixed bottom-0 left-0">
    <div className="flex justify-center py-4">
     


<Header />


    </div>
  </div>
          </div>


        </>
      )}
    </div>
    </div>

  );
}

export default protectedPage(Transactions);
