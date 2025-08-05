const motivationalQuotes = [
  "Your attitude determines your direction.",
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Don't watch the clock; do what it does. Keep going.",
  "Believe you can and you're halfway there.",
  "You are never too old to set another goal or to dream a new dream.",
  "It always seems impossible until it's done.",
  "Start where you are. Use what you have. Do what you can.",
  "You don't have to be great to start, but you have to start to be great.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Happiness is not something ready-made. It comes from your own actions.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Keep your face always toward the sunshine, and shadows will fall behind you.",
  "It's not whether you get knocked down, it's whether you get up.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "The power of imagination makes us infinite.",
  "Light tomorrow with today.",
  "Every moment is a fresh beginning.",
  "Life is 10% what happens to us and 90% how we react to it."
];

export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

export const getMoodQuote = (mood: string): string => {
  const moodQuotes: Record<string, string[]> = {
    happy: [
      "Happiness is a journey, not a destination.",
      "The best way to cheer yourself is to try to cheer someone else up.",
      "Happiness is not by chance, but by choice.",
      "Count your age by friends, not years. Count your life by smiles, not tears.",
      "The present moment is filled with joy and happiness. If you are attentive, you will see it."
    ],
    sad: [
      "Even the darkest night will end and the sun will rise.",
      "Sadness flies away on the wings of time.",
      "The way I see it, if you want the rainbow, you gotta put up with the rain.",
      "Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit.",
      "It's okay to not be okay as long as you are not giving up."
    ],
    angry: [
      "For every minute you remain angry, you give up sixty seconds of peace of mind.",
      "When angry, count to ten before you speak. If very angry, count to one hundred.",
      "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.",
      "Speak when you are angry and you'll make the best speech you'll ever regret.",
      "The greatest remedy for anger is delay."
    ],
    neutral: [
      "Balance is not something you find, it's something you create.",
      "Life is about balance. Be kind, but don't let people abuse you. Trust, but don't be deceived. Be content, but never stop improving yourself.",
      "Calmness of mind is one of the beautiful jewels of wisdom.",
      "Sometimes you need to sit lonely on the floor in a quiet room in order to hear your own voice and not let it drown in the noise of others.",
      "In the midst of movement and chaos, keep stillness inside of you."
    ],
    excited: [
      "The future belongs to those who believe in the beauty of their dreams.",
      "Do what you can, with what you have, where you are.",
      "Dream big and dare to fail.",
      "Enthusiasm moves the world.",
      "Adventure awaits, go find it!"
    ]
  };

  const defaultQuotes = [
    "Whatever you are feeling is valid.",
    "Your emotions are important messengers.",
    "Take each day one step at a time.",
    "You don't have to be perfect to be amazing.",
    "This too shall pass."
  ];

  const moodSpecificQuotes = moodQuotes[mood.toLowerCase()] || defaultQuotes;
  const randomIndex = Math.floor(Math.random() * moodSpecificQuotes.length);
  return moodSpecificQuotes[randomIndex];
};