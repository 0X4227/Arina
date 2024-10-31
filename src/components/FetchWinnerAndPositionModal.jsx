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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import tableData from "@/datasets/tableData.json";

export function FetchWinnerAndPositionModal({ onClick }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className="bg-newSecondary hover:bg-orange-600 text-dark py-2 px-4 rounded-full w-fit hover:scale-[1.1]"
          onClick={onClick}
        >
          Fetch Winner & Position
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-dark text-[32px] bg-tertiary ">
        <DialogHeader>
          <DialogTitle className="text-newSecondary rounded-full">
            Winner & Position
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto min-h-96 max-h-[500px] border border-gray-300 rounded-lg pb-4 pt-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] text-newSecondary font-bold">
                  Sr. No.
                </TableHead>
                <TableHead className="text-newSecondary font-bold">
                  Wallet ID
                </TableHead>
                <TableHead className="text-newSecondary font-bold">
                  Position
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((data) => (
                <TableRow
                  key={data.id}
                  className="hover:bg-tertiary hover:text-newSecondary"
                >
                  <TableCell className="font-medium">{data.id}</TableCell>
                  <TableCell>{data.wallet_id}</TableCell>
                  <TableCell className="text-center">{data.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
