// src/components/PopulationChart.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface PopulationComposition {
  year: number;
  total: number;
  young: number;
  working: number;
  elderly: number;
}

interface PopulationChartProps {
  data: Record<string, number | string>[];
  selectedPrefectures: number[];
  prefNames: { [key: number]: string };
}

const PopulationChart: React.FC<PopulationChartProps> = ({ data, selectedPrefectures, prefNames }) => {
  const labels = data.map((entry) => entry.year);

  const datasets = selectedPrefectures.map((prefCode, index) => {
    const dataPoints = data.map((entry) => entry[`pref_${prefCode}`] as number);
    const color = `hsl(${(index * 360) / selectedPrefectures.length}, 70%, 50%)`;
    return {
      label: prefNames[prefCode],
      data: dataPoints,
      borderColor: color,
      backgroundColor: color,
      fill: false,
    };
  });

  const chartData: ChartData<'line'> = {
    labels,
    datasets,
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '都道府県別人口推移',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default PopulationChart;
