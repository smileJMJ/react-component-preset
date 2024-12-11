import { useGlobalContext } from '@rfc/contexts/GlobalContext';

const NoData = () => {
  const { l10n } = useGlobalContext()!;

  return (
    <div className="rfc-content-nodata">
      <p>{l10n?.content?.nodata}</p>
    </div>
  );
};

export default NoData;
