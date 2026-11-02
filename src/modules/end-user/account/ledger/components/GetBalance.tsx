import { useGetLedgerBalance } from "../hooks";

type PropsLedger = {
  ledgerId: string;
};

export const LedgerBalance = ({ ledgerId }: PropsLedger) => {
  const { data: ledger } = useGetLedgerBalance(ledgerId);

  if (!ledger) return <div>Loading...</div>;

  const isCredit = ledger.balance > 0;
  const displayBalance = Math.abs(ledger.balance);
  const isLow = displayBalance < 100;

  const balanceClass = isLow ? "text-red-500" : "text-teal-500";

  return (
    <div className={balanceClass}>
      {displayBalance} {isCredit ? "Cr" : "Dr"}
    </div>
  );
};
