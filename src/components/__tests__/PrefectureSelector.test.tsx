// src/components/__tests__/PrefectureSelector.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrefectureSelector from '../PrefectureSelector';
import { Prefecture } from '../../api/resas';

describe('PrefectureSelector', () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: '北海道' },
    { prefCode: 2, prefName: '青森県' },
  ];
  
  const mockOnChange = jest.fn();
  
  it('renders prefectures correctly', () => {
    render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={[]}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByLabelText('北海道')).toBeInTheDocument();
    expect(screen.getByLabelText('青森県')).toBeInTheDocument();
  });
  
  it('handles checkbox change', () => {
    render(
      <PrefectureSelector
        prefectures={mockPrefectures}
        selectedPrefectures={[]}
        onChange={mockOnChange}
      />
    );
    
    const checkbox = screen.getByLabelText('北海道') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });
});
