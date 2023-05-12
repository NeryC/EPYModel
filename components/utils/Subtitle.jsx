import { descriptions } from "../../utils/descriptions";
import { useTranslation } from "next-i18next";

const Subtitle = ({ page, type }) => {
  const { t } = useTranslation("common");
  const subtitle = descriptions[page][type];

  if (subtitle)
    return (
      <div className="text-base pt-2 text-text-secondary whitespace-pre-line">
        {t(`${type}-subtitle`)}
      </div>
    );
};

export default Subtitle;
