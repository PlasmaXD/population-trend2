// src/pages/index.tsx
import React, { useState, useEffect } from 'react';
import PrefectureSelector from '../components/PrefectureSelector';
import PopulationChart from '../components/PopulationChart';
import { fetchPopulationComposition, fetchPrefectures, PopulationComposition, Prefecture } from '../api/resas';

type PopulationType = 'total' | 'young' | 'working' | 'elderly';

const HomePage: React.FC = () => {
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<{ [key: number]: PopulationComposition[] }>({});
  const [currentType, setCurrentType] = useState<PopulationType>('total');
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPrefectures = async () => {
      try {
        const data = await fetchPrefectures();
        console.log('Fetched prefectures:', data); // デバッグ用ログ
        if (data && data.length > 0) {
          setPrefectures(data);
        } else {
          setError('都道府県のデータ取得に失敗しました。');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching prefectures:', error);
          setError(error.message || '都道府県データの取得に失敗しました。');
        }
      }
    };
    getPrefectures();
  }, []);

  const handlePrefChange = (prefCode: number) => {
    setSelectedPrefectures((prev) =>
      prev.includes(prefCode) ? prev.filter((code) => code !== prefCode) : [...prev, prefCode]
    );
  };

  useEffect(() => {
    const getPopulationData = async () => {
      const data: { [key: number]: PopulationComposition[] } = {};
      try {
        await Promise.all(
          selectedPrefectures.map(async (prefCode) => {
            const res = await fetchPopulationComposition(prefCode);
            if (res) {
              data[prefCode] = res;
            }
          })
        );
        setPopulationData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching population data:', error);
          setError(error.message || '人口データの取得に失敗しました。');
        }
      }
    };

    if (selectedPrefectures.length > 0) {
      getPopulationData();
    } else {
      setPopulationData({});
    }
  }, [selectedPrefectures]);

  const prefNames = prefectures.reduce((acc, pref) => {
    acc[pref.prefCode] = pref.prefName;
    return acc;
  }, {} as { [key: number]: string });

  const formattedData = () => {
    const years = new Set<number>();
    Object.values(populationData).forEach((prefData) => {
      if (Array.isArray(prefData)) {
        prefData.forEach((entry) => years.add(entry.year));
      } else {
        console.error('prefData is not an array:', prefData);
      }
    });

    const sortedYears = Array.from(years).sort();

    return sortedYears.map((year) => {
      const entry: Record<string, number | string> = { year };
      selectedPrefectures.forEach((prefCode) => {
        const prefEntry = populationData[prefCode]?.find((e) => e.year === year);
        if (prefEntry) {
          entry[`pref_${prefCode}`] = prefEntry[currentType];
        }
      });
      return entry;
    });
  };

  return (
    <div>
      <h1>都道府県別総人口推移グラフ</h1>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <PrefectureSelector
          prefectures={prefectures}
          selectedPrefectures={selectedPrefectures}
          onChange={handlePrefChange}
        />
      )}

      <div>
        <label>
          <input
            type="radio"
            value="total"
            checked={currentType === 'total'}
            onChange={() => setCurrentType('total')}
          />
          総人口
        </label>
        <label>
          <input
            type="radio"
            value="young"
            checked={currentType === 'young'}
            onChange={() => setCurrentType('young')}
          />
          年少人口
        </label>
        <label>
          <input
            type="radio"
            value="working"
            checked={currentType === 'working'}
            onChange={() => setCurrentType('working')}
          />
          生産年齢人口
        </label>
        <label>
          <input
            type="radio"
            value="elderly"
            checked={currentType === 'elderly'}
            onChange={() => setCurrentType('elderly')}
          />
          老年人口
        </label>
      </div>

      {selectedPrefectures.length > 0 && (
        <PopulationChart
          data={formattedData()}
          selectedPrefectures={selectedPrefectures}
          prefNames={prefNames}
        />
      )}
    </div>
  );
};

export default HomePage;//export default Home; // または export default HomePage;
