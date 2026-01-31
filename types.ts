export enum Language {
  French = 'French',
  English = 'English',
}

export enum AppView {
  MainMenu = 'MainMenu',
  TrainingSetup = 'TrainingSetup',
  AddContent = 'AddContent',
  Stats = 'Stats',
  Unfinished = 'Unfinished',
  Settings = 'Settings',
}

export enum CardClass {
  Noun = 'Noun',
  Verb = 'Verb',
  Adjective = 'Adjective',
  Adverb = 'Adverb',
  Expression = 'Expression',
}

export enum Gender {
  Masc = 'Masc',
  Fem = 'Fem',
  None = 'None', // For plural nouns or words where gender isn't the focus
}

export enum VerbType {
  Regular = 'Regular',
  Irregular = 'Irregular',
}

export enum QuestionType {
  Meaning = 'Meaning', // Both
  Gender = 'Gender', // French Nouns
  Conjugation = 'Conjugation', // French Verbs
  Synonyms = 'Synonyms', // English
  Antonyms = 'Antonyms', // English
}

export interface Lesson {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
  lessons: Lesson[];
}

// --- DATABASE SCHEMA ---

export interface Card {
  id: string;
  
  // Core Data
  article?: string; // e.g., "la", "un"
  word: string; // The stripped word e.g., "table"
  translation: string; // Arabic meaning
  gender: Gender;
  class: CardClass;

  // Conjugation Data (For Verbs)
  infinitive?: string;
  conjugations?: string[]; // Array of 6: [je, tu, il/elle, nous, vous, ils/elles]
  verbType?: VerbType;

  // English Specific Data
  synonyms?: string[];
  antonyms?: string[];

  // Metadata
  language: Language;
  unitId: string;
  lessonId: string;
  sourceFileId?: string; // To link back to the specific uploaded file
  createdAt: number;
}

export interface CardCounts {
  [QuestionType.Meaning]: number;
  [QuestionType.Gender]?: number;
  [QuestionType.Conjugation]?: number;
  [QuestionType.Synonyms]?: number;
  [QuestionType.Antonyms]?: number;
}

export interface TrainingConfig {
  language: Language;
  selectedLessonIds: string[];
  selectedClasses: CardClass[];
  selectedQuestionTypes: QuestionType[];
  cardLimit: number;
}
