// src/api/resas.ts

import axios from 'axios';

// 共通の API レスポンス形式
interface RESASApiResponse<T> {
  message: string | null;
  result: T;
}

// 都道府県情報のインターフェース
export interface Prefecture {
  prefCode: number;
  prefName: string;
}

// 人口構成データのインターフェース
export interface PopulationComposition {
  year: number;
  total: number;
  young: number;
  working: number;
  elderly: number;
}

// 人口構成APIの結果データ構造
interface PopulationDataEntry {
  label: string;
  data: Array<{
    year: number;
    value: number;
  }>;
}

interface PopulationCompositionResult {
  data: PopulationDataEntry[];
}

// 環境変数の確認
const RESAS_API_BASE_URL = 'https://opendata.resas-portal.go.jp/api/v1'; // 外部 RESAS API のベースURL
const RESAS_API_KEY = process.env.RESAS_API_KEY;

if (!RESAS_API_KEY) {
  throw new Error('RESAS_API_KEY is not defined');
}

// Axios クライアントの設定
const apiClient = axios.create({
  baseURL: RESAS_API_BASE_URL,
  headers: {
    'X-API-KEY': RESAS_API_KEY,
    'Accept': 'application/json',
  },
});

/**
 * 都道府県データを取得する関数
 * @returns Promise<Prefecture[]>
 */
export const fetchPrefectures = async (): Promise<Prefecture[]> => {
  try {
    const response = await apiClient.get<RESASApiResponse<Prefecture[]>>('/prefectures');
    console.log('Response data from API:', response.data);

    if (response.status === 200 && response.data && Array.isArray(response.data.result)) {
      return response.data.result;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: unknown) {
    console.error('Failed to fetch prefectures:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error ${status}: ${message}`);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

/**
 * 都道府県の人口構成データを取得する関数
 * @param prefCode - Prefecture code
 * @returns Promise<PopulationComposition[] | null>
 */
export const fetchPopulationComposition = async (prefCode: number): Promise<PopulationComposition[] | null> => {
  try {
    const response = await apiClient.get<RESASApiResponse<PopulationCompositionResult>>('/population/composition/perYear', {
      params: {
        prefCode,
        cityCode: '-', // 全市区町村を対象とする場合は '-' を使用
      },
    });
    console.log('Response data from API:', response.data);

    if (
      response.status === 200 &&
      response.data &&
      response.data.result &&
      Array.isArray(response.data.result.data)
    ) {
      const data = response.data.result.data;

      // 各人口区分ごとのデータを抽出
      const totalDataEntry = data.find((item) => item.label === '総人口');
      const youngDataEntry = data.find((item) => item.label === '年少人口');
      const workingDataEntry = data.find((item) => item.label === '生産年齢人口');
      const elderlyDataEntry = data.find((item) => item.label === '老年人口');

      if (!totalDataEntry || !youngDataEntry || !workingDataEntry || !elderlyDataEntry) {
        throw new Error('Incomplete population data');
      }

      // 各年ごとの人口構成データをマッピング
      const populationData: PopulationComposition[] = totalDataEntry.data.map((item, index) => ({
        year: item.year,
        total: item.value,
        young: youngDataEntry.data[index]?.value || 0,
        working: workingDataEntry.data[index]?.value || 0,
        elderly: elderlyDataEntry.data[index]?.value || 0,
      }));

      return populationData;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: unknown) {
    console.error(`Failed to fetch population composition for prefCode ${prefCode}:`, error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new Error(`Error ${status}: ${message}`);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
