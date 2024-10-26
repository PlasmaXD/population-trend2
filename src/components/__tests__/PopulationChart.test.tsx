// PopulationChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import PopulationChart from '../PopulationChart';
interface MockLineProps {
  data: {
    labels: number[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  options?: object;
}
jest.mock('react-chartjs-2', () => ({
    Line: (props: MockLineProps) => {
        return (
      <div data-testid="chart-mock">
        {JSON.stringify(props)}
      </div>
    );
  },
}));

describe('PopulationChart', () => {
  it('passes correct data to the Line component', () => {
    const mockData = [
      { year: 2000, pref_1: 500, pref_2: 600 },
      { year: 2005, pref_1: 550, pref_2: 650 },
    ];
    const mockPrefNames = { 1: '北海道', 2: '青森県' };

    render(
      <PopulationChart
        data={mockData}
        selectedPrefectures={[1, 2]}
        prefNames={mockPrefNames}
      />
    );

    const chartMock = screen.getByTestId('chart-mock');
    const chartProps = JSON.parse(chartMock.textContent || '{}');

    // データの検証
    expect(chartProps.data.labels).toEqual([2000, 2005]);
    expect(chartProps.data.datasets.length).toBe(2);
    expect(chartProps.data.datasets[0].label).toBe('北海道');
    expect(chartProps.data.datasets[1].label).toBe('青森県');
  });
});
