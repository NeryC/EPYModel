import { useTranslation } from "next-i18next";

const Footer = () => {
  const { t } = useTranslation("common");
  return (
    <footer className="bg-back pb-10 text-center font-bold">
      {t(`more-information`)}
      <a className="underline text-blue-600" target="_blank" href="https://www.mdpi.com/2076-3417/11/20/9726/htm" rel="noopener noreferrer">
        {t(`go-here`)}
      </a>
    </footer>
  );
};

export default Footer;
