// مسیر: frontend/src/components/charts/StudentsByGradeChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StudentsByGradeChart({ chartData }) {
  const data = {
    labels: chartData.map(item => item.grade), // پایه‌های تحصیلی
    datasets: [
      {
        label: 'تعداد دانش‌آموزان',
        data: chartData.map(item => item.count), // تعداد دانش‌آموزان
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'تعداد دانش‌آموزان به تفکیک پایه تحصیلی',
        font: {
            family: 'sans-serif',
            size: 16
        }
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default StudentsByGradeChart;