"use client"

import * as React from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("h-full w-full", className)} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: any[]
    layout?: "horizontal" | "vertical"
  }
>(({ className, data, layout = "horizontal", ...props }, ref) => (
  <div ref={ref} className={cn("h-full w-full", className)} {...props}>
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        layout={layout}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        {props.children}
      </ComposedChart>
    </ResponsiveContainer>
  </div>
))
Chart.displayName = "Chart"

const ChartPie = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data?: any[]
    dataKey?: string
    nameKey?: string
    cx?: string | number
    cy?: string | number
    innerRadius?: number
    outerRadius?: number
    children?: React.ReactNode
    label?: boolean | React.ReactNode | Function
  }
>(({ className, data, dataKey, nameKey, cx, cy, innerRadius, outerRadius, children, label, ...props }, ref) => {
  if (data) {
    return (
      <div ref={ref} className={cn("h-full w-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              label={label}
            >
              {children}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <Pie
      dataKey={dataKey}
      nameKey={nameKey}
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      label={label}
    >
      {children}
    </Pie>
  )
})
ChartPie.displayName = "ChartPie"

const ChartTooltip = React.forwardRef<React.ElementRef<typeof Tooltip>, React.ComponentPropsWithoutRef<typeof Tooltip>>(
  ({ className, ...props }, ref) => (
    <Tooltip
      ref={ref}
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                {payload.map((entry, index) => (
                  <div key={`item-${index}`} className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">{entry.name}</span>
                    <span className="font-bold text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return null
      }}
      {...props}
    />
  ),
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<React.ElementRef<typeof Legend>, React.ComponentPropsWithoutRef<typeof Legend>>(
  ({ className, ...props }, ref) => (
    <Legend
      ref={ref}
      iconSize={12}
      iconType="circle"
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      {...props}
    />
  ),
)
ChartLegend.displayName = "ChartLegend"

const ChartGrid = React.forwardRef<
  React.ElementRef<typeof CartesianGrid>,
  React.ComponentPropsWithoutRef<typeof CartesianGrid>
>(({ className, ...props }, ref) => <CartesianGrid ref={ref} strokeDasharray="3 3" {...props} />)
ChartGrid.displayName = "ChartGrid"

const ChartXAxis = React.forwardRef<React.ElementRef<typeof XAxis>, React.ComponentPropsWithoutRef<typeof XAxis>>(
  ({ className, ...props }, ref) => (
    <XAxis ref={ref} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} {...props} />
  ),
)
ChartXAxis.displayName = "ChartXAxis"

const ChartYAxis = React.forwardRef<React.ElementRef<typeof YAxis>, React.ComponentPropsWithoutRef<typeof YAxis>>(
  ({ className, ...props }, ref) => (
    <YAxis ref={ref} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} {...props} />
  ),
)
ChartYAxis.displayName = "ChartYAxis"

const ChartLine = React.forwardRef<React.ElementRef<typeof Line>, React.ComponentPropsWithoutRef<typeof Line>>(
  ({ className, ...props }, ref) => <Line ref={ref} type="monotone" strokeWidth={2} activeDot={{ r: 6 }} {...props} />,
)
ChartLine.displayName = "ChartLine"

const ChartBar = React.forwardRef<React.ElementRef<typeof Bar>, React.ComponentPropsWithoutRef<typeof Bar>>(
  ({ className, ...props }, ref) => <Bar ref={ref} {...props} />,
)
ChartBar.displayName = "ChartBar"

const ChartArea = React.forwardRef<React.ElementRef<typeof Area>, React.ComponentPropsWithoutRef<typeof Area>>(
  ({ className, ...props }, ref) => <Area ref={ref} type="monotone" strokeWidth={2} {...props} />,
)
ChartArea.displayName = "ChartArea"

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartLine,
  ChartBar,
  ChartArea,
  ChartPie,
}
