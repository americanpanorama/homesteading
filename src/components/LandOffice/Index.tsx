import * as React from 'react';
import { useLandOfficeData } from '../../hooks';
import BarChartLegendItem from './BarCharts/LegendItem';
import BarChart from './BarCharts/Claims';
import BarChartPatents from './BarCharts/Patents';
import { LandOfficeViewModel } from '../../hooks/landOffice';
import * as Styled from './styled';

type SelectedView = 'number' | 'acres' | 'average_size';
const MEASURE_OPTIONS: Array<{ value: SelectedView; label: string }> = [
  { value: 'number', label: 'Number' },
  { value: 'acres', label: 'Acres' },
  { value: 'average_size', label: 'Average Size' },
];

interface Props {
  data?: LandOfficeViewModel | null;
}

const LandOffice = ({ data: providedData }: Props) => {
  const data = providedData ?? useLandOfficeData();
  const [stacked, setStacked] = React.useState(true);
  const [selectedView, setSelectedView] = React.useState<SelectedView>('number');

  if (!data) {
    return null;
  }

  const { chartData, hasMultipleClaimTypes, hasMultiplePatentTypes } = data;

  React.useEffect(() => {
    setStacked(true);
    setSelectedView('number');
  }, [chartData.name, chartData.type]);

  return (
    <Styled.Container>
      <Styled.ControlsCard>
        <Styled.Legend>
          {(chartData.total_claims_federal_lands > 0 || chartData.total_patents_federal_lands > 0) && (
            <BarChartLegendItem
              className='federal_lands'
              label='claims or patents on federal land'
            />
          )}
          {(chartData.total_claims_indian_lands > 0 || chartData.total_patents_indian_lands > 0) && (
            <BarChartLegendItem
              className='indian_lands'
              label='claims or patents on Indian land'
            />
          )}
          {(chartData.total_commutations_2301 > 0) && (
            <BarChartLegendItem
              className='commutations_2301'
              label='commutations on federal land under 2301'
            />
          )}
          {(chartData.total_commutations_18800615 > 0) && (
            <BarChartLegendItem
              className='commutations_18800615'
              label='commutations on federal land under 1880'
            />
          )}
          {(chartData.total_commutations_indian_lands > 0) && (
            <BarChartLegendItem
              className='commutations_indian_lands'
              label='commutations on Indian land'
            />
          )}
        </Styled.Legend>

        <Styled.ControlsGrid>
          <Styled.ControlGroup>
            <Styled.SegmentedControl>
              <Styled.ControlButton
                type='button'
                onClick={() => { setStacked(true); }}
                $active={stacked}
                disabled={selectedView === 'average_size'}
              >
                Stacked
              </Styled.ControlButton>
              <Styled.ControlButton
                type='button'
                onClick={() => { setStacked(false); }}
                $active={!stacked}
              >
                Grouped
              </Styled.ControlButton>
            </Styled.SegmentedControl>
          </Styled.ControlGroup>

          <Styled.ControlGroup>
            <Styled.Select
              id='land-office-measure'
              value={selectedView}
              onChange={event => {
                const nextView = event.target.value as SelectedView;
                setSelectedView(nextView);
                if (nextView === 'average_size') {
                  setStacked(false);
                }
              }}
              aria-label='Select chart measure'
            >
              {MEASURE_OPTIONS.map(option => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </Styled.Select>
          </Styled.ControlGroup>
        </Styled.ControlsGrid>
      </Styled.ControlsCard>

      <Styled.ChartBlock>
        <Styled.ChartTitle>Claims</Styled.ChartTitle>
        <BarChart
          chartData={chartData}
          stacked={stacked || !hasMultipleClaimTypes}
          selectedView={selectedView}
          label='claims'
        />
      </Styled.ChartBlock>

      <Styled.ChartBlock>
        <Styled.ChartTitle>Patents</Styled.ChartTitle>
        <BarChartPatents
          chartData={chartData}
          stacked={stacked || !hasMultiplePatentTypes}
          selectedView={selectedView}
          label='claims'
        />
      </Styled.ChartBlock>
    </Styled.Container>
  );
};

export default LandOffice;
