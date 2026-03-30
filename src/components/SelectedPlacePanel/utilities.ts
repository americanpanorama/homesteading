// @ts-ignore
import us from '../../us';
import { LandOfficeViewModel } from '../../hooks/landOffice';

const formatOfficeName = (name: string) => name.replace(/([a-z.])([A-Z])/g, '$1 $2');

export const getStateTerritoryLabel = (stateTerr: string, yearNum: number, fallbackName?: string) => {
  const place = us.lookup(stateTerr);
  const name = fallbackName || place?.name || stateTerr;
  const isTerritory = !place?.statehood_year || place.statehood_year > yearNum;
  return `${name}${isTerritory ? ' Territory' : ''}`;
};

export const getSelectedPlaceTitle = ({
  office,
  stateTerr,
  yearNum,
  selectedPlaceName,
  stateName,
}: {
  office?: string;
  stateTerr?: string;
  yearNum: number;
  selectedPlaceName?: string;
  stateName?: string;
}) => {
  if (!selectedPlaceName) {
    return '';
  }

  if (!office || !stateTerr) {
    return stateTerr ? getStateTerritoryLabel(stateTerr, yearNum, stateName || selectedPlaceName) : selectedPlaceName;
  }

  return `${formatOfficeName(selectedPlaceName)}, ${getStateTerritoryLabel(stateTerr, yearNum, stateName)}`;
};

export const getSelectedPlaceSummarySnippet = (
  data: LandOfficeViewModel | null,
  year: string,
  yearNum: number,
): string => {
  if (!data?.selectedYearData) {
    return '';
  }

  const { chartData, selectedYearData } = data;
  const isOffice = chartData.type === 'office';
  const isState = !isOffice && us.lookup(chartData.name)?.statehood_year <= yearNum;
  const subject = isOffice ? 'district' : isState ? 'state' : 'territory';

  return `In ${year}, ${selectedYearData.total_claims.toLocaleString()} claims covered ${selectedYearData.total_acres_claimed.toLocaleString()} acres, ${selectedYearData.area_claimed_percent}% of the ${subject}.`;
};
