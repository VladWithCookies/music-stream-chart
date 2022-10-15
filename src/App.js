import { prop, map, pipe, path } from 'ramda';
import { scaleTime, scaleLinear, scaleOrdinal, extent, stack, stackOffsetExpand, area, curveBasis, timeFormat } from 'd3';

import { MUSIC_GENRES_DATA_URL } from 'constants/data';
import { COLORS } from 'constants/theme';
import useData from 'hooks/useData';

export default function App() {
  const data = useData(MUSIC_GENRES_DATA_URL);

  if (!data) return null;

  const keys = data.columns.slice(1);

  const height = window.innerHeight;
  const width = window.innerWidth;

  const margin = {
    top: 50,
    right: 200,
    bottom: 100,
    left: 80,
  };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xValue = prop('Date');

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0]);

  const colorScale = scaleOrdinal()
    .domain(keys)
    .range(COLORS);

  const createStack = stack()
    .offset(stackOffsetExpand)
    .keys(keys);

  const createArea = area()
    .curve(curveBasis)
    .x(pipe(path(['data', 'Date']), xScale))
    .y0(pipe(prop(0), yScale))
    .y1(pipe(prop(1), yScale));

  const stackedData = createStack(data);

  const formatTime = timeFormat('%Y');

  return (
    <svg
      height={height}
      width={width}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {map((tick) => (
          <g
            key={tick}
            transform={`translate(${xScale(tick)}, 0)`}
          >
            <line
              y2={innerHeight}
              className="scale"
            />
            <text
              y={innerHeight + 10}
              dy="0.71em"
              className="tick"
            >
              {formatTime(tick)}
            </text>
          </g>
        ), xScale.ticks())}
        <text
          className="label"
          transform={`translate(-30, ${innerHeight / 2}) rotate(-90)`}
        >
          Popularity
        </text>
        <text
          x={innerWidth / 2}
          y={innerHeight + 70}
          className="label"
        >
          Time
        </text>
        {map((item) => (
          <path
            key={item.key}
            d={createArea(item)}
            fill={colorScale(item.key)}
            className="area"
          />
        ), stackedData)}
      </g>
      <g transform={`translate(${innerWidth + 120}, ${margin.top + 8})`}>
        {colorScale.domain().reverse().map((item, index) => (
          <g
            key={item}
            transform={`translate(0, ${index * 30})`}
          >
            <circle
              r={10}
              fill={colorScale(item)}
            />
            <text
              x={20}
              dy="0.32em"
            >
              {item}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
