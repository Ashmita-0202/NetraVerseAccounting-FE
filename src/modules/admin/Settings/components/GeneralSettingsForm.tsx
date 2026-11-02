// import { AppCombobox } from "@/components/common/ComboBox";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const GeneralSettings = () => {
  const lan = localStorage.getItem("language");
  const [language, setLanguage] = useState(lan ?? "English");
  const { t, i18n } = useTranslation();
  // const handleChange = (data: string) => {
  //   i18n.changeLanguage(data);
  // };
  useEffect(() => {
    if (language) {
      localStorage.setItem("language", language);
      if (language === "नेपाली") {
        i18n.changeLanguage("ne");
      } else i18n.changeLanguage("en");
    }
  }, [language, i18n]);
  const languages = [
    { code: "en", label: "English" },
    { code: "ne", label: "नेपाली" },
  ];
  return (
    <div>
      <h1>{t("GeneralSettings")}</h1>
      <div>
        <Listbox value={language} onChange={setLanguage}>
          <ListboxButton className="border w-full text-left p-2">
            {language}
          </ListboxButton>
          <ListboxOptions className="border mt-1 bg-white">
            {languages.map((status) => (
              <ListboxOption
                key={status.code}
                value={status.label}
                className="p-2 hover:bg-blue-100 cursor-pointer"
              >
                {status.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    </div>
  );
};
export default GeneralSettings;
