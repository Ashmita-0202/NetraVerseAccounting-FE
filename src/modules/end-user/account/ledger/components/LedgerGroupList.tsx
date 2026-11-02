import { useGetLedgerGroupsByMaster } from "../../ledgerGroup/hooks";
import { useEffect } from "react";

interface Props {
  masterId: string;
  setSelectedLedgerGroup: React.Dispatch<React.SetStateAction<string>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  handleSelectLedger: (ledgerId: string, ledgerName: string) => void;
}

const LedgerGroupList = ({
  masterId,
  setSelectedLedgerGroup,
  setSearchTerm,
  setIsDropdownOpen,
  searchTerm,
  handleSelectLedger,
}: Props) => {
  const { data, refetch } = useGetLedgerGroupsByMaster(masterId);

  useEffect(() => {
    refetch();
  }, [masterId, refetch]);

  if (!data || data.length === 0) {
    return (
      <option disabled className="text-gray-500">
        Ledger Group Not Found
      </option>
    );
  }
  const filteredGroups = data.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {filteredGroups.map((group) => (
        <li
          key={group.id}
          className="mx-2 px-2 py-1 cursor-pointer rounded-sm hover:bg-gray-100 flex justify-start"
          onClick={() => {
            handleSelectLedger(group.id, group.name);
            setSelectedLedgerGroup(group.id);
            setSearchTerm(group.name);
            setIsDropdownOpen(false);
          }}
        >
          {group.name}
        </li>
      ))}
    </>
  );
};

export default LedgerGroupList;
