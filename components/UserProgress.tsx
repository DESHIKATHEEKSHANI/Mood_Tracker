'use client';

import { useEffect, useState } from 'react';
import { getMoods, Mood } from '@/lib/moodUtils';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserProgress = () => {
  const [trackedDays, setTrackedDays] = useState(0);
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    const moods = getMoods();
    
    // Count unique days with mood entries
    const uniqueDays = new Set();
    moods.forEach((mood: Mood) => {
      const date = new Date(mood.date).toDateString();
      uniqueDays.add(date);
    });
    
    setTrackedDays(uniqueDays.size);
    
    // Prepare chart data
    if (moods.length > 0) {
      prepareChartData(moods);
    } else {
      setChartData(getEmptyChartData());
    }
  }, []);
  
  const prepareChartData = (moods: Mood[]) => {
    // Get last 7 days for the chart
    const last7Days: string[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    // Group moods by day and calculate average mood values
    // For this example, we'll map mood types to numeric values
    const moodValues: Record<string, number> = {
      'happy': 5,
      'excited': 4,
      'neutral': 3,
      'sad': 2,
      'angry': 1
    };
    
    const moodsByDay: Record<string, number[]> = {};
    
    last7Days.forEach(day => {
      moodsByDay[day] = [];
    });
    
    moods.forEach(mood => {
      const moodDate = new Date(mood.date);
      if (moodDate >= new Date(today.setDate(today.getDate() - 7))) {
        const day = moodDate.toLocaleDateString('en-US', { weekday: 'short' });
        const moodValue = moodValues[mood.moodType] || 3; // Default to neutral if unknown
        
        if (moodsByDay[day]) {
          moodsByDay[day].push(moodValue);
        }
      }
    });
    
    // Calculate average mood for each day
    const averageMoods = last7Days.map(day => {
      const dayMoods = moodsByDay[day];
      if (dayMoods.length === 0) return null;
      
      const sum = dayMoods.reduce((acc, val) => acc + val, 0);
      return sum / dayMoods.length;
    });
    
    setChartData({
      labels: last7Days,
      datasets: [
        {
          label: 'Mood Level',
          data: averageMoods,
          borderColor: 'hsl(var(--chart-1))',
          backgroundColor: 'rgba(var(--chart-1-rgb), 0.2)',
          fill: true,
          tension: 0.4,
          spanGaps: true,
        }
      ]
    });
  };
  
  const getEmptyChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Mood Level',
          data: [null, null, null, null, null, null, null],
          borderColor: 'hsl(var(--chart-1))',
          backgroundColor: 'rgba(var(--chart-1-rgb), 0.2)',
          tension: 0.4,
        }
      ]
    };
  };
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            switch (value) {
              case 5: return 'Happy';
              case 4: return 'Excited';
              case 3: return 'Neutral';
              case 2: return 'Sad';
              case 1: return 'Angry';
              default: return '';
            }
          }
        },
        grid: {
          display: true
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            let mood = 'No data';
            
            if (value === 5) mood = 'Happy';
            else if (value === 4) mood = 'Excited';
            else if (value === 3) mood = 'Neutral';
            else if (value === 2) mood = 'Sad';
            else if (value === 1) mood = 'Angry';
            
            return `Mood: ${mood}`;
          }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Your Mood Journey</h3>
        <div className="h-64">
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col justify-center">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{trackedDays}</div>
          <p className="text-lg mb-4">
            {trackedDays === 1 ? 'Day' : 'Days'} of mood tracking
          </p>
          <div className="inline-flex items-center justify-center bg-primary/10 px-4 py-2 rounded-full">
            <span className="mr-2">🎯</span>
            <span className="font-medium">Keep it up!</span>
          </div>
          
          {trackedDays > 0 && (
            <p className="mt-6 text-muted-foreground">
              Consistent tracking helps you understand your emotional patterns better.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProgress;