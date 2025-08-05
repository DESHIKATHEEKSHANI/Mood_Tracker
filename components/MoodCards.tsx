import Image from 'next/image';
import { getMoodQuote } from '@/lib/quoteUtils';
import { MOOD_TYPES } from '@/lib/moodUtils';

const MoodCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOOD_TYPES.slice(0, 3).map((mood) => (
        <div key={mood.type} className="bg-card rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="relative h-48">
            <Image 
              src={getMoodImageUrl(mood.type)} 
              alt={`${mood.type} mood`}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{mood.emoji}</span>
              <h3 className="text-xl font-semibold capitalize">{mood.type}</h3>
            </div>
            <p className="text-muted-foreground">{getMoodCardDescription(mood.type)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const getMoodImageUrl = (moodType: string): string => {
  const moodImages: Record<string, string> = {
    happy: "https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    sad: "https://images.pexels.com/photos/236151/pexels-photo-236151.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    angry: "https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    neutral: "https://images.pexels.com/photos/594421/pexels-photo-594421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    excited: "https://images.pexels.com/photos/2923156/pexels-photo-2923156.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  };
  
  return moodImages[moodType] || "https://images.pexels.com/photos/594421/pexels-photo-594421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
};

const getMoodCardDescription = (moodType: string): string => {
  const descriptions: Record<string, string> = {
    happy: "Celebrate your joyful moments and spread positivity!",
    sad: "It's okay to feel low sometimes. Be gentle with yourself.",
    angry: "Find healthy ways to express and process your frustrations.",
    neutral: "A balanced state of mind can be a great foundation.",
    excited: "Channel your enthusiasm into creative pursuits!",
  };
  
  return descriptions[moodType] || getMoodQuote(moodType);
};

export default MoodCards;