import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

type Props = {
  title: string;
  button?: JSX.Element;
};

const TitleHeader = ({ title, button }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <>
      <header className="p-2 py-3 px-6 font-bold  bg-white text-lg flex justify-between border-b rounded-md shadow mx-4 pt-4  mt-2">
        <h1 className="">
          {t(`${title}`)}
          <div className="text-xs font-bold text-teal-500">
            {pathParts.map((part, index) => {
              const partialPath = "/" + pathParts.slice(0, index + 1).join("/");

              if (index === pathParts.length - 2) {
                return null;
              }

              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              if (uuidRegex.test(part)) {
                return null;
              }

              return (
                <Link to={partialPath} key={index + 1}>
                  <span>/{t(`${part}`)}</span>
                </Link>
              );
            })}
          </div>
        </h1>

        <div className="flex justify-end  ">
          <div className="flex items-center">{button}</div>
        </div>
      </header>
    </>
  );
};
export default TitleHeader;
