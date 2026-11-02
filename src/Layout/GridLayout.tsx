type Props = {
  children: React.ReactNode;
  className?: string;
};

const GridLayout = ({ children, className = "" }: Props) => {
  return (
    <div className={`grid grid-flow-row gap-4 ${className} items-start`}>
      {children}
    </div>
  );
};

export default GridLayout;
