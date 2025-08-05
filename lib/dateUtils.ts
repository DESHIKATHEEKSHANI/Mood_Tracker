export const getCurrentGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
};

export const getWeekRange = (date: Date = new Date()): { start: Date, end: Date } => {
  const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = date.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust to get Monday
  
  const startDate = new Date(date);
  startDate.setDate(diff);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  
  return { start: startDate, end: endDate };
};

export const formatWeekRange = (weekRange: { start: Date, end: Date }): string => {
  const startMonth = weekRange.start.toLocaleString('default', { month: 'short' });
  const endMonth = weekRange.end.toLocaleString('default', { month: 'short' });
  
  const startDay = weekRange.start.getDate();
  const endDay = weekRange.end.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};