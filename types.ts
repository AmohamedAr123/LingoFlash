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

export interface CardCounts {
  [QuestionType.Meaning]: number;
  [QuestionType.Gender]?: number;
  [QuestionType.Conjugation]?: number;
  [QuestionType.Synonyms]?: number;
  [QuestionType.Antonyms]?: number;
}

export interface TrainingConfig {
  language: Language;
  selectedLessonIds: string[]; // Changed from selectedUnitIds to allow granular control
  selectedClasses: CardClass[];
  selectedQuestionTypes: QuestionType[];
  cardLimit: number;
}
