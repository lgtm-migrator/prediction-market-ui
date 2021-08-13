import { ResponsiveLine, Serie } from '@nivo/line';
import styled from '@emotion/styled';
import { Grid, Paper, useTheme, Chip, Stack } from '@material-ui/core';
import React from 'react';
import { Typography } from '../../atoms/Typography';

const ChartWrapper = styled(Paper)`
  padding: 2rem;
`;

interface RangeSelectorProps {
  defaultValue: string | number;
  values: {
    label: string;
    value: string | number;
  }[];
  onChange: (value: string | number) => Promise<void> | void;
}

export interface LineChartProps {
  data?: Serie[];
  rangeSelector?: RangeSelectorProps;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ defaultValue, values, onChange }) => {
  const [range, setRange] = React.useState(defaultValue);

  const handleRangeSelection = React.useCallback(
    (newRange: string | number) => {
      onChange(newRange);
      setRange(newRange);
    },
    [onChange],
  );

  return (
    <Stack direction="row" spacing={1} aria-label="range-selector">
      {values.map(({ label, value }, index) => (
        <Chip
          label={<Typography size="h6">{label}</Typography>}
          color={value === range ? 'primary' : 'secondary'}
          key={`${index}-${value}`}
          sx={{ marginX: '0.5rem', px: '0.3rem' }}
          onClick={() => handleRangeSelection(value)}
          size="small"
        />
      ))}
    </Stack>
  );
};

export const LineChart: React.FC<LineChartProps> = ({ data = [], rangeSelector }) => {
  const theme = useTheme();

  return (
    <ChartWrapper>
      <Grid container direction="column">
        {rangeSelector && (
          <Grid item container direction="row-reverse">
            <RangeSelector {...rangeSelector} />
          </Grid>
        )}
        <Grid item height="30rem">
          <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 50, bottom: 65, left: 60 }}
            xScale={{ type: 'point' }}
            colors={[theme.palette.success.main, theme.palette.error.main]}
            yScale={{
              type: 'linear',
              min: 0,
              max: 100,
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legendOffset: 15,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Yes/No %',
              legendOffset: -40,
              legendPosition: 'middle',
            }}
            pointSize={3}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={4}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh
            enableGridX={false}
            legends={[
              {
                anchor: 'top-left',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -54,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </Grid>
      </Grid>
    </ChartWrapper>
  );
};
