// src/pages/api/resas/[...path].ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const RESAS_API_BASE_URL = 'https://opendata.resas-portal.go.jp/api/v1';
const RESAS_API_KEY = process.env.RESAS_API_KEY;

if (!RESAS_API_KEY) {
  throw new Error('RESAS_API_KEY is not defined');
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { path = [], ...query } = req.query;
  const apiPath = Array.isArray(path) ? path.join('/') : path;

  const headers = {
    'X-API-KEY': RESAS_API_KEY,
    'Accept': 'application/json',
  };

  // デバッグ用にリクエストヘッダーをログに出力
  console.log('Request headers:', headers);
  console.log('Request path:', apiPath);
  console.log('Request query:', query);

  try {
    const response = await axios.get(`${RESAS_API_BASE_URL}/${apiPath}`, {
      headers,
      params: query,
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`Error fetching ${apiPath}:`, error.message);
    console.error('Error response data:', error.response?.data);

    res.status(error.response?.status || 500).json({
      message: error.message,
      statusCode: error.response?.status || 500,
      errorData: error.response?.data || null,
    });
  }
};
