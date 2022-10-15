import { prop, map, pipe, path } from 'ramda';
import { scaleTime, scaleLinear, scaleOrdinal, extent, stack, stackOffsetNone, area } from 'd3';

import { MUSIC_GENRES_DATA_URL } from 'constants/data';
import useData from 'hooks/useData';

export default function App() {
  const data = useData(MUSIC_GENRES_DATA_URL);

  if (!data) return null;

  const keys = data.columns.slice(1);

  const height = window.innerHeight;
  const width = window.innerWidth;

  const margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  const xValue = prop('Date');

  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([0, 200])
    .range([innerHeight, 0]);

  const colorScale = scaleOrdinal()
    .domain(keys)
    .range(['purple', 'brown', 'orange', 'yellow', 'green']);

  const createStack = stack()
    .offset(stackOffsetNone)
    .keys(keys);

  const createArea = area()
    .x(pipe(path(['data', 'Date']), xScale))
    .y0(pipe(prop(0), yScale))
    .y1(pipe(prop(1), yScale));

  const stackedData = createStack(data);

  return (
    <svg
      height={height}
      width={width}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {map((item) => (
          <path
            key={item.key}
            d={createArea(item)}
            fill={colorScale(item.key)}
          />
        ), stackedData)}
      </g>
      <g transform={`translate(${innerWidth - 40}, ${margin.top})`}>
        {colorScale.domain().map((item, index) => (
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
