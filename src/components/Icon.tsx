import React from "react";
import * as Icons from "lucide-react";

interface Props {
  name: string;
  size?: number;
}

const Icon = ({ name, size }: Props) => {
  const IconComponent = Icons[name as keyof typeof Icons] as React.ElementType;

  if (!IconComponent) {
    return <Icons.Hash />;
  }
  return (
    <>
      <IconComponent size={size} />
    </>
  );
};

export default Icon;
