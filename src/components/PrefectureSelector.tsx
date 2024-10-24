// src/components/PrefectureSelector.tsx
import React from 'react';
import { Prefecture } from '../api/resas';

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onChange: (prefCode: number) => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({
  prefectures,
  selectedPrefectures,
  onChange,
}) => {
  return (
    <div className="prefecture-selector">
            {/* <h2>都道府県を選択してください</h2> */}

      {prefectures.map((pref) => (
        <label key={pref.prefCode} className="prefecture-item">
          <input
            type="checkbox"
            value={pref.prefCode}
            checked={selectedPrefectures.includes(pref.prefCode)}
            onChange={() => onChange(pref.prefCode)}
          />
          {pref.prefName}
        </label>
      ))}
    </div>
  );
};

export default PrefectureSelector;
