import { useMemo } from 'react'
import * as d3 from 'd3'

type CaloriesBarChartProps = {
  consumed: number
  burned: number
  balance: number
}

type ChartDatum = {
  label: string
  value: number
  color: string
}

export default function CaloriesBarChart({ consumed, burned, balance }: CaloriesBarChartProps) {
  const width = 560
  const height = 320
  const margin = { top: 24, right: 16, bottom: 54, left: 56 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const data = useMemo<ChartDatum[]>(
    () => [
      { label: 'Consumidas', value: consumed, color: '#84cc16' },
      { label: 'Quemadas', value: burned, color: '#f97316' },
      { label: 'Balance', value: balance, color: '#38bdf8' },
    ],
    [consumed, burned, balance]
  )

  const xScale = useMemo(
    () =>
      d3
        .scaleBand<string>()
        .domain(data.map((item) => item.label))
        .range([0, innerWidth])
        .padding(0.35),
    [data, innerWidth]
  )

  const yScale = useMemo(() => {
    const minValue = d3.min(data, (item) => item.value) ?? 0
    const maxValue = d3.max(data, (item) => item.value) ?? 0

    return d3
      .scaleLinear()
      .domain([Math.min(0, minValue), Math.max(0, maxValue)])
      .nice()
      .range([innerHeight, 0])
  }, [data, innerHeight])

  const yTicks = useMemo(() => yScale.ticks(5), [yScale])
  const zeroLineY = yScale(0)

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4 md:p-5">
      <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-slate-200">
        Grafico de Barras (Resumen)
      </h3>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {yTicks.map((tick) => (
            <g key={`tick-${tick}`} transform={`translate(0, ${yScale(tick)})`}>
              <line x1={0} x2={innerWidth} className="stroke-slate-700" />
              <text x={-10} y={4} textAnchor="end" className="fill-slate-400 text-xs">
                {tick}
              </text>
            </g>
          ))}

          <line x1={0} x2={innerWidth} y1={zeroLineY} y2={zeroLineY} className="stroke-slate-500" />

          {data.map((item) => {
            const x = xScale(item.label) ?? 0
            const barTop = item.value >= 0 ? yScale(item.value) : zeroLineY
            const barHeight = Math.abs(yScale(item.value) - zeroLineY)
            const textY = item.value >= 0 ? barTop - 8 : barTop + barHeight + 16

            return (
              <g key={item.label}>
                <rect
                  x={x}
                  y={barTop}
                  width={xScale.bandwidth()}
                  height={Math.max(barHeight, 1)}
                  rx={8}
                  fill={item.color}
                />

                <text
                  x={x + xScale.bandwidth() / 2}
                  y={textY}
                  textAnchor="middle"
                  className="fill-slate-200 text-xs font-semibold"
                >
                  {item.value} cal
                </text>

                <text
                  x={x + xScale.bandwidth() / 2}
                  y={innerHeight + 28}
                  textAnchor="middle"
                  className="fill-slate-300 text-xs font-semibold uppercase tracking-wide"
                >
                  {item.label}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

