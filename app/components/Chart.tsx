'use client';

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  data: { id: number; name: string; value: number }[];
};

export default function PieChart({ data }: PieChartProps) {
  const colors = [
    'hsl(0, 70%, 50%)',    
    'hsl(234, 70%, 50%)',  
    'hsl(288, 70%, 50%)',  
    'hsl(36, 70%, 50%)',   
    'hsl(342, 70%, 50%)',  
    'hsl(54, 70%, 50%)',   
    'hsl(180, 70%, 50%)',  
    'hsl(72, 70%, 50%)',   
    'hsl(90, 70%, 50%)',   
    'hsl(18, 70%, 50%)',   
    'hsl(126, 70%, 50%)',  
    'hsl(144, 70%, 50%)',  
    'hsl(162, 70%, 50%)',  
    'hsl(108, 70%, 50%)',  
    'hsl(198, 70%, 50%)',  
    'hsl(216, 70%, 50%)',  
    'hsl(252, 70%, 50%)',  
    'hsl(270, 70%, 50%)',  
    'hsl(306, 70%, 50%)',  
    'hsl(324, 70%, 50%)',  
  ];

  const filteredData = data.filter((d) => d.value > 0);

  const chartData = {
    labels: filteredData.map((d) => d.name),
    datasets: [
      {
        data: filteredData.map((d) => d.value),
        backgroundColor: colors.slice(0, filteredData.length),
        hoverOffset: 20,
      },
    ],
  }; 

  const option = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "left",
        labels: {
          font: {
            size: 10,
          },
          // color: "#1f2937", 
          boxWidth: 10,
          padding: 5,
        },
      },
      Tooltip: {
        enabled: true,
      }
    },
  };

  return <Pie data={chartData} options={option} />;
}
