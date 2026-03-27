import { useEffect, useMemo, useRef } from "react"
import * as d3 from "d3"
import type { Activity } from "../types"

type CaloriesChartProps = {
  activities: Activity[]
}

type ChartDatum = {
  label: string
  value: number
  color: string
}

const formatCalories = (value: number) => new Intl.NumberFormat("es-ES").format(value)

export default function CaloriesChart({ activities }: CaloriesChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  const chartData = useMemo<ChartDatum[]>(() => {
    const consumedCalories = activities
      .filter((activity) => activity.category === 1 && activity.calories > 0)
      .reduce((total, activity) => total + activity.calories, 0)

    const burnedCalories = activities
      .filter((activity) => activity.category === 2 && activity.calories > 0)
      .reduce((total, activity) => total + activity.calories, 0)

    const totalBalance = consumedCalories - burnedCalories

    return [
      { label: "Consumidas", value: consumedCalories, color: "#16a34a" },
      { label: "Quemadas", value: burnedCalories, color: "#dc2626" },
      { label: "Balance", value: totalBalance, color: "#2563eb" },
    ]
  }, [activities])

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 520
    const height = 280
    const margin = { top: 20, right: 24, bottom: 46, left: 62 }

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("role", "img")
      .attr("aria-label", "Grafico de calorias consumidas, quemadas y balance")

    const minValue = d3.min(chartData, (d) => Math.min(d.value, 0)) ?? 0
    const maxValue = d3.max(chartData, (d) => Math.max(d.value, 0)) ?? 0
    const paddedMin = minValue < 0 ? minValue * 1.15 : 0
    const paddedMax = maxValue > 0 ? maxValue * 1.15 : 10

    const xScale = d3
      .scaleBand<string>()
      .domain(chartData.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.35)

    const yScale = d3
      .scaleLinear()
      .domain([paddedMin, paddedMax])
      .nice()
      .range([height - margin.bottom, margin.top])

    const axisBottom = d3.axisBottom(xScale)
    const axisLeft = d3.axisLeft(yScale).ticks(6)

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(axisBottom)
      .call((g) => g.select(".domain").attr("stroke", "#cbd5e1"))
      .call((g) => g.selectAll("line").attr("stroke", "#cbd5e1"))
      .call((g) => g.selectAll("text").attr("fill", "#334155").attr("font-size", 12))

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(axisLeft)
      .call((g) => g.select(".domain").attr("stroke", "#cbd5e1"))
      .call((g) => g.selectAll("line").attr("stroke", "#e2e8f0"))
      .call((g) => g.selectAll("text").attr("fill", "#334155").attr("font-size", 12))

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#94a3b8")
      .attr("stroke-dasharray", "4 3")

    svg
      .append("g")
      .selectAll("rect")
      .data(chartData)
      .join("rect")
      .attr("x", (d) => xScale(d.label) ?? 0)
      .attr("y", (d) => (d.value >= 0 ? yScale(d.value) : yScale(0)))
      .attr("height", (d) => Math.abs(yScale(d.value) - yScale(0)))
      .attr("width", xScale.bandwidth())
      .attr("rx", 8)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.88)

    svg
      .append("g")
      .selectAll("text")
      .data(chartData)
      .join("text")
      .text((d) => formatCalories(d.value))
      .attr("x", (d) => (xScale(d.label) ?? 0) + xScale.bandwidth() / 2)
      .attr("y", (d) => (d.value >= 0 ? yScale(d.value) - 8 : yScale(d.value) + 18))
      .attr("text-anchor", "middle")
      .attr("fill", "#0f172a")
      .attr("font-size", 12)
      .attr("font-weight", 600)
  }, [chartData])

  return (
    <div className="chart-card">
      <svg ref={svgRef} className="chart-card__svg" />
      {activities.length === 0 && (
        <p className="chart-card__empty">Agrega actividades para ver una comparacion visual.</p>
      )}
    </div>
  )
}

