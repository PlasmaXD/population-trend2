// src/api/resas.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

interface RESASApiResponse<T> {
  message: string | null;
  result: T;
}

export interface PopulationComposition {
  year: number;
  total: number;
  young: number;
  working: number;
  elderly: number;
}

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

const isProduction = process.env.NODE_ENV === 'production';
const RESAS_API_BASE_URL = '/api/resas'; // Next.js APIルートを使用
const apiClient = axios.create({
  baseURL: RESAS_API_BASE_URL,
  headers: isProduction
    ? {}
    : { 'Content-Type': 'application/json' },
});

export const fetchPrefectures = async (): Promise<Prefecture[]> => {
  try {
    const response = await apiClient.get<RESASApiResponse<Prefecture[]>>('/prefectures');
    console.log('Response data from API:', response.data);

    if (response.status === 200 && response.data && Array.isArray(response.data.result)) {
      return response.data.result;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error('Failed to fetch prefectures:', error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      throw new Error(`Error ${status}: ${message}`);
    } else {
      throw new Error('Network error');
    }
  }
};

export const fetchPopulationComposition = async (prefCode: number): Promise<PopulationComposition[] | null> => {
  try {
    const response = await apiClient.get<RESASApiResponse<any>>('/population/composition/perYear', {
      params: {
        prefCode,
        cityCode: '-',
      },
    });
    console.log('Response data from API:', response.data);

    if (response.status === 200 && response.data && response.data.result && response.data.result.data) {
      const data = response.data.result.data;

      // 各人口区分ごとにデータを抽出
      const totalData = data.find((item: any) => item.label === '総人口')?.data || [];
      const youngData = data.find((item: any) => item.label === '年少人口')?.data || [];
      const workingData = data.find((item: any) => item.label === '生産年齢人口')?.data || [];
      const elderlyData = data.find((item: any) => item.label === '老年人口')?.data || [];

      const populationData: PopulationComposition[] = totalData.map((item: any, index: number) => ({
        year: item.year,
        total: item.value,
        young: youngData[index]?.value || 0,
        working: workingData[index]?.value || 0,
        elderly: elderlyData[index]?.value || 0,
      }));

      return populationData;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    console.error(`Failed to fetch population composition for prefCode ${prefCode}:`, error);

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      throw new Error(`Error ${status}: ${message}`);
    } else {
      throw new Error('Network error');
    }
  }
};
