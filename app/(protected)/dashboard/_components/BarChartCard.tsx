"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartCardProps {
  data: BarChartData[];
  loading: boolean;
  title?: string;
  subtitle?: string;
}

export function BarChartCard({
  data,
  loading,
  title = "Analisis Siswa & Porsi",
  subtitle = "Bar Chart",
}: BarChartCardProps) {
  if (loading) {
    return (
      <Card className="shadow-sm rounded-xl h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
          <BarChart2 className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
          <Skeleton className="w-full h-64 rounded-lg" />
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
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: data.map((d) => d.color),
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: "x" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed.y.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString("id-ID");
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
        <BarChart2 className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="w-full h-64 flex items-center justify-center">
          <Bar data={chartData} options={options} />
        </div>
        <div className="flex justify-between mt-4 text-xs gap-4">
          {data.map((d) => (
            <span key={d.label} className="flex items-center gap-1 flex-1">
              <span
                style={{ background: d.color }}
                className="inline-block w-2 h-2 rounded-full shrink-0"
              ></span>
              <span className="truncate">
                {d.label}: <b>{d.value.toLocaleString("id-ID")}</b>
              </span>
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
