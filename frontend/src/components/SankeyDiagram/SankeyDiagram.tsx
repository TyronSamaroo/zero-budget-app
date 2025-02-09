import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { Box, useTheme } from '@mui/material';

export interface SankeyNode {
  name: string;
  category: 'income' | 'expense' | 'savings';
  value: number;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface SankeyDiagramProps {
  data: SankeyData;
  width?: number;
  height?: number;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  data,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create sankey generator
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[margin.left, margin.top], [innerWidth, innerHeight]]);

    // Generate the sankey diagram
    const { nodes, links } = sankeyGenerator(data);

    // Add links
    svg
      .append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', theme.palette.primary.light)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => Math.max(1, d.width || 0));

    // Add nodes
    const node = svg
      .append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d) => d.x0 || 0)
      .attr('y', (d) => d.y0 || 0)
      .attr('height', (d) => (d.y1 || 0) - (d.y0 || 0))
      .attr('width', (d) => (d.x1 || 0) - (d.x0 || 0))
      .attr('fill', (d) => {
        switch (d.category) {
          case 'income':
            return theme.palette.success.main;
          case 'expense':
            return theme.palette.error.main;
          case 'savings':
            return theme.palette.info.main;
          default:
            return theme.palette.grey[500];
        }
      });

    // Add labels
    svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d) => (d.x0 || 0) - 6)
      .attr('y', (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text((d) => `${d.name} ($${d.value})`)
      .style('font-size', '10px')
      .style('fill', theme.palette.text.primary);

  }, [data, width, height, theme]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </Box>
  );
};

export default SankeyDiagram; 