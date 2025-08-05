'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
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
import { Mood } from '@/lib/moodUtils';

// Register ChartJS components
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

interface MoodChartProps {
  moods: Mood[];
  weekRange: { start: Date; end: Date };
}

const MoodChart = ({ moods, weekRange }: MoodChartProps) => {
  // Generate days of the week
  const days = useMemo(() => {
    const daysArray = [];
    const currentDate = new Date(weekRange.start);
    
    while (currentDate <= weekRange.end) {
      daysArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return daysArray;
  }, [weekRange]);
  
  // Map mood types to numeric values for the chart
  const moodValues = {
    'happy': 5,
    'excited': 4,
    'neutral': 3,
    'sad': 2,
    'angry': 1
  };
  
  // Prepare chart data
  const chartData = useMemo(() => {
    // Group moods by day
    const moodsByDay: Record<string, number[]> = {};
    
    // Initialize all days with empty arrays
    days.forEach(day => {
      moodsByDay[day.toDateString()] = [];
    });
    
    // Add moods to the appropriate day
    moods.forEach(mood => {
      const moodDate = new Date(mood.date);
      const dateKey = moodDate.toDateString();
      
      if (moodsByDay[dateKey]) {
        const moodValue = mood.moodType in moodValues 
          ? moodValues[mood.moodType as keyof typeof moodValues] 
          : 3; // Default to neutral
        
        moodsByDay[dateKey].push(moodValue);
      }
    });
    
    // Calculate average mood for each day
    const averageMoods = days.map(day => {
      const dayMoods = moodsByDay[day.toDateString()];
      if (dayMoods.length === 0) return null;
      
      const sum = dayMoods.reduce((acc, val) => acc + val, 0);
      return sum / dayMoods.length;
    });
    
    // Format day labels
    const dayLabels = days.map(day => 
      day.toLocaleDateString('en-US', { weekday: 'short' })
    );
    
    return {
      labels: dayLabels,
      datasets: [
        {
          label: 'Mood',
          data: averageMoods,
          borderColor: 'hsl(var(--chart-1))',
          backgroundColor: 'hsla(var(--chart-1), 0.2)',
          fill: true,
          tension: 0.4,
          spanGaps: true,
          pointBackgroundColor: 'hsl(var(--chart-1))',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [moods, days]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 6,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            switch (value) {
              case 5: return 'Happy';
              case 4: return 'Excited';
              case 3: return 'Neutral';
              case 2: return 'Sad';
              case 1: return 'Angry';
              default: return '';
            }
          },
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            let mood = 'No data';
            
            if (value >= 4.5) mood = 'Happy';
            else if (value >= 3.5) mood = 'Excited';
            else if (value >= 2.5) mood = 'Neutral';
            else if (value >= 1.5) mood = 'Sad';
            else if (value >= 0.5) mood = 'Angry';
            
            return `Mood: ${mood}`;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default MoodChart;