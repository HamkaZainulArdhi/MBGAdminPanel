"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  data: PieChartData[];
  loading: boolean;
  title?: string;
  subtitle?: string;
  chartHeight?: string; // e.g., "h-48", "h-64", "h-80"
  chartWidth?: string; // e.g., "w-full", "w-80"
}

export function PieChartCard({
  data,
  loading,
  title = "Distribusi Sekolah",
  subtitle = "Pie Chart",
  chartHeight = "h-48",
  chartWidth = "w-80",
}: PieChartCardProps) {
  if (loading) {
    return (
      <Card className="shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
          <PieChart className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <Skeleton className={`w-full ${chartHeight} rounded-lg`} />
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: subtitle,
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderColor: "#fff",
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="shadow-sm rounded-xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <PieChart className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div
          className={`${chartWidth} ${chartHeight} flex items-center justify-center`}
        >
          <Pie data={chartData} options={options} />
        </div>
        <div className="flex flex-col justify-between mt-4 text-xs space-y-2">
          {data.map((d) => (
            <span key={d.label} className="flex items-center gap-1">
              <span
                style={{ background: d.color }}
                className="inline-block w-2 h-2 rounded-full"
              ></span>
              {d.label}: <b>{d.value}</b>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
