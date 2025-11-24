"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    income: {
        label: "Pemasukan",
        color: "var(--chart-2)",
    },
    expense: {
        label: "Pengeluaran",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export default function ChartAreaGradient({ chartData }: {
    chartData: [
        {
            date: string;
            income: number;
            expense: number;
        }
    ]
}) {
    return <ChartContainer config={chartConfig} className="bg-white p-2 rounded-lg">
        <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
                left: 16,
                right: 16,
            }}
        >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{
                    fontSize: 10,
                }}
                tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate().toString()} ${date.toLocaleString("default", { month: "short" })}`;
                }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
                <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-expense)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-expense)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="5%"
                        stopColor="var(--color-income)"
                        stopOpacity={0.8}
                    />
                    <stop
                        offset="95%"
                        stopColor="var(--color-income)"
                        stopOpacity={0.1}
                    />
                </linearGradient>
            </defs>
            <Area
                dataKey="expense"
                type="natural"
                fill="url(#fillExpense)"
                fillOpacity={0.4}
                stroke="var(--color-expense)"
                stackId="a"
            />
            <Area
                dataKey="income"
                type="natural"
                fill="url(#fillIncome)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
    </ChartContainer>
}
