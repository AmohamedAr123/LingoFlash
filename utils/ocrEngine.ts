import { Card, CardClass, Gender, Language, VerbType } from "../types";

/**
 * UTILS: Text Processing Logic
 */

// French Article Splitting Logic
// Separates "la table" into { article: "la", word: "table" }
export const splitFrenchArticle = (rawText: string): { article?: string, word: string } => {
    const text = rawText.trim();
    // Common French articles (definite, indefinite, contracted)
    const articles = /^(le|la|les|un|une|des|l'|d')\s+/i;
    
    // Check for apostrophe cases like l'homme
    const apostropheMatch = text.match(/^(l'|d')([a-zàâçéèêëîïôûùüÿñæœ]+)/i);
    if (apostropheMatch) {
        return { article: apostropheMatch[1], word: apostropheMatch[2] };
    }

    const match = text.match(articles);
    if (match) {
        const article = match[0].trim(); // e.g., "la"
        const word = text.substring(match[0].length).trim(); // e.g., "table"
        return { article, word };
    }

    return { word: text };
};

/**
 * ENGINE: Simulation of AI Extraction
 * Generates valid Card objects from "scanned" files.
 */
export const simulateFileProcessing = async (
    files: File[], 
    language: Language,
    unitId: string,
    lessonId: string
): Promise<Card[]> => {
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const extractedCards: Card[] = [];

    // MOCK DATA GENERATION based on Language
    // In a real app, this would call an OCR API (Google Vision) + LLM (Gemini)

    if (language === Language.French) {
        // Mock French Extraction
        const mockFrenchWords = [
            { raw: "la table", trans: "طاولة", class: CardClass.Noun, gender: Gender.Fem },
            { raw: "le livre", trans: "كتاب", class: CardClass.Noun, gender: Gender.Masc },
            { raw: "manger", trans: "يأكل", class: CardClass.Verb, gender: Gender.None },
            { raw: "grand", trans: "كبير", class: CardClass.Adjective, gender: Gender.Masc },
            { raw: "parler", trans: "يتحدث", class: CardClass.Verb, gender: Gender.None },
        ];

        mockFrenchWords.forEach((item, index) => {
            const { article, word } = splitFrenchArticle(item.raw);
            
            let card: Card = {
                id: `card_${Date.now()}_${index}`,
                article,
                word,
                translation: item.trans,
                gender: item.gender,
                class: item.class,
                language: Language.French,
                unitId,
                lessonId,
                createdAt: Date.now(),
            };

            // Verb Logic: Auto-fill conjugations if it's a verb
            if (item.class === CardClass.Verb) {
                card.infinitive = word;
                card.verbType = VerbType.Regular;
                // Mock conjugations (je, tu, il/elle, nous, vous, ils/elles)
                // In real app, Gemini would provide these.
                const root = word.replace(/er$/, ''); 
                if (word.endsWith('er')) {
                     card.conjugations = [
                        `${root}e`, `${root}es`, `${root}e`, 
                        `${root}ons`, `${root}ez`, `${root}ent`
                     ];
                } else {
                     card.conjugations = ["???", "???", "???", "???", "???", "???"];
                }
            }

            extractedCards.push(card);
        });

    } else {
        // Mock English Extraction
        const mockEnglishWords = [
            { raw: "Happy", trans: "سعيد", class: CardClass.Adjective },
            { raw: "Run", trans: "يجري", class: CardClass.Verb },
            { raw: "Success", trans: "نجاح", class: CardClass.Noun },
        ];

        mockEnglishWords.forEach((item, index) => {
             extractedCards.push({
                id: `card_en_${Date.now()}_${index}`,
                word: item.raw,
                translation: item.trans,
                gender: Gender.None,
                class: item.class,
                synonyms: item.class === CardClass.Adjective ? ["Joyful", "Cheerful"] : [],
                antonyms: item.class === CardClass.Adjective ? ["Sad", "Depressed"] : [],
                language: Language.English,
                unitId,
                lessonId,
                createdAt: Date.now(),
            });
        });
    }

    return extractedCards;
};
