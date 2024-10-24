// src/components/PrefectureSelector.tsx

import React from 'react';

interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefectureSelectorProps {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onChange: (prefCode: number) => void;
}

const PrefectureSelector: React.FC<PrefectureSelectorProps> = ({ prefectures, selectedPrefectures, onChange }) => {
  return (
    <div>
      <h2>都道府県を選択してください</h2>
      <ul>
        {prefectures.map((pref) => (
          <li key={pref.prefCode}>
            <label>
              <input
                type="checkbox"
                checked={selectedPrefectures.includes(pref.prefCode)}
                onChange={() => onChange(pref.prefCode)}
              />
              {pref.prefName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrefectureSelector;
