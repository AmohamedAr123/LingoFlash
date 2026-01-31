import { CardClass, CardCounts, Language, QuestionType, Unit } from "./types";

// Mock Units with Lessons
export const INITIAL_UNITS: Unit[] = [
  {
    id: "u1",
    name: "Unit 1: Basics",
    lessons: [
      { id: "l1_1", name: "Greetings" },
      { id: "l1_2", name: "Numbers" }
    ]
  },
  {
    id: "u2",
    name: "Unit 2: Travel",
    lessons: [
      { id: "l2_1", name: "Airport" },
      { id: "l2_2", name: "Hotel" },
      { id: "l2_3", name: "Directions" }
    ]
  },
  {
    id: "u3",
    name: "Unit 3: Business",
    lessons: [
        { id: "l3_1", name: "Meetings" }
    ]
  },
  {
    id: "u4",
    name: "Unit 4: Literature",
    lessons: []
  }
];

// Mock logic to simulate dynamic counters based on filters
export const getMockCounts = (
  lang: Language, 
  classes: CardClass[], 
  selectedLessonIds: string[]
): CardCounts => {
  
  // Base numbers simulation based on selected lessons count
  const lessonMultiplier = selectedLessonIds.length > 0 ? selectedLessonIds.length : 0;
  
  // If no lessons selected, count is 0
  if (lessonMultiplier === 0) {
      return {
        [QuestionType.Meaning]: 0,
        [QuestionType.Gender]: 0,
        [QuestionType.Conjugation]: 0,
        [QuestionType.Synonyms]: 0,
        [QuestionType.Antonyms]: 0,
      };
  }

  const totalBase = 25 * lessonMultiplier; // Approx 25 cards per lesson

  let nounRatio = 0;
  let verbRatio = 0;
  let otherRatio = 0;

  // If no classes selected, assume ALL
  if (classes.length === 0) {
    nounRatio = 0.4;
    verbRatio = 0.3;
    otherRatio = 0.3;
  } else {
    if (classes.includes(CardClass.Noun)) nounRatio += 0.4;
    if (classes.includes(CardClass.Verb)) verbRatio += 0.3;
    if (classes.includes(CardClass.Adjective) || classes.includes(CardClass.Adverb)) otherRatio += 0.3;
  }

  const nounCount = Math.floor(totalBase * nounRatio);
  const verbCount = Math.floor(totalBase * verbRatio);
  const otherCount = Math.floor(totalBase * otherRatio);
  const totalSelected = nounCount + verbCount + otherCount;

  if (lang === Language.French) {
    return {
      [QuestionType.Meaning]: totalSelected,
      [QuestionType.Gender]: nounCount, // Only nouns have gender questions
      [QuestionType.Conjugation]: verbCount, // Only verbs have conjugation
    };
  } else {
    return {
      [QuestionType.Meaning]: totalSelected,
      [QuestionType.Synonyms]: Math.floor(totalSelected * 0.6), // Assume 60% have synonyms
      [QuestionType.Antonyms]: Math.floor(totalSelected * 0.4), // Assume 40% have antonyms
    };
  }
};
