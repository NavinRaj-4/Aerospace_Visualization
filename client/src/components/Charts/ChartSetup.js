import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global Aerospace Dark Chart Defaults
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.font.family = 'JetBrains Mono, monospace';
ChartJS.defaults.font.size = 11;
ChartJS.defaults.borderColor = 'rgba(51, 65, 85, 0.4)';

export const chartCommonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 600,
    easing: 'easeOutQuart'
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#cbd5e1',
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 14,
        font: {
          family: 'JetBrains Mono, monospace',
          size: 11
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(11, 17, 32, 0.95)',
      titleColor: '#22d3ee',
      titleFont: {
        family: 'JetBrains Mono, monospace',
        size: 12,
        weight: 'bold'
      },
      bodyColor: '#e2e8f0',
      bodyFont: {
        family: 'JetBrains Mono, monospace',
        size: 11
      },
      borderColor: 'rgba(6, 182, 212, 0.4)',
      borderWidth: 1,
      padding: 10,
      boxPadding: 4,
      usePointStyle: true
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(51, 65, 85, 0.35)',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: { family: 'JetBrains Mono, monospace' }
      }
    },
    y: {
      grid: {
        color: 'rgba(51, 65, 85, 0.35)',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: { family: 'JetBrains Mono, monospace' }
      }
    }
  }
};
