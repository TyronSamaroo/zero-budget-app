import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SankeyDiagram from './SankeyDiagram';
import { ThemeProvider, createTheme } from '@mui/material';
import { SankeyData } from './SankeyDiagram';

const mockData: SankeyData = {
  nodes: [
    { name: 'Income', category: 'income' as const, value: 5000 },
    { name: 'Rent', category: 'expense' as const, value: 2000 },
    { name: 'Savings', category: 'savings' as const, value: 1000 },
  ],
  links: [
    { source: 0, target: 1, value: 2000 },
    { source: 0, target: 2, value: 1000 },
  ],
};

describe('SankeyDiagram', () => {
  const theme = createTheme();

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <SankeyDiagram data={mockData} />
      </ThemeProvider>
    );
    // The component uses SVG, so we'll check if it's in the document
    const svg = document.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('renders with custom dimensions', () => {
    const customWidth = 1000;
    const customHeight = 800;

    render(
      <ThemeProvider theme={theme}>
        <SankeyDiagram data={mockData} width={customWidth} height={customHeight} />
      </ThemeProvider>
    );

    const svg = document.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe(customWidth.toString());
    expect(svg?.getAttribute('height')).toBe(customHeight.toString());
  });
}); 