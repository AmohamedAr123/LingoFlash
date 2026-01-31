import { Card, CardClass, QuestionType } from "../types";

/**
 * CARD ELIGIBILITY RULES
 * Determines if a card is valid for a specific question type.
 */
export const isCardEligibleForType = (card: Card, type: QuestionType): boolean => {
    switch (type) {
        case QuestionType.Meaning:
            return !!card.word && !!card.translation;
        
        case QuestionType.Gender:
            // Must be a French Noun with a defined gender
            return card.class === CardClass.Noun && 
                   (card.gender === 'Masc' || card.gender === 'Fem');
        
        case QuestionType.Conjugation:
            // Must be a Verb, have infinitive, and have FULL conjugations (6)
            return card.class === CardClass.Verb && 
                   !!card.infinitive && 
                   Array.isArray(card.conjugations) && 
                   card.conjugations.length === 6 &&
                   !card.conjugations.includes("???"); // Ensure no missing data
        
        case QuestionType.Synonyms:
            return !!card.synonyms && card.synonyms.length > 0;
            
        case QuestionType.Antonyms:
            return !!card.antonyms && card.antonyms.length > 0;
            
        default:
            return false;
    }
};

/**
 * SMART MERGING LOGIC
 * Merges new extracted cards into the existing database.
 * If (Word + Class) matches, we merge data instead of creating a duplicate.
 */
export const mergeCards = (existingCards: Card[], newCards: Card[]): Card[] => {
    const updatedDatabase = [...existingCards];

    newCards.forEach(newCard => {
        // 1. Check for duplicate (Same Word AND Same Class)
        const matchIndex = updatedDatabase.findIndex(
            existing => 
                existing.word.toLowerCase() === newCard.word.toLowerCase() && 
                existing.class === newCard.class
        );

        if (matchIndex > -1) {
            // MATCH FOUND: Merge Logic
            const existingCard = updatedDatabase[matchIndex];
            
            // A. Update Metadata (Source, latest timestamp)
            // Note: We don't overwrite unitId/lessonId of the original, 
            // but in a relational DB we would have a many-to-many link. 
            // For this flat structure, we assume the card now belongs to the newest context 
            // OR we could add a 'tags' array. For now, let's just log it.
            console.log(`Merging data for ${newCard.word}...`);

            // B. Enrich Data: If existing is missing conjugations, add them
            if (newCard.class === CardClass.Verb && newCard.conjugations && (!existingCard.conjugations || existingCard.conjugations.length === 0)) {
                updatedDatabase[matchIndex] = {
                    ...existingCard,
                    infinitive: newCard.infinitive,
                    conjugations: newCard.conjugations,
                    verbType: newCard.verbType
                };
            }
            
            // C. Enrich Data: English Synonyms
            if (newCard.synonyms && newCard.synonyms.length > 0) {
                 const mergedSynonyms = Array.from(new Set([...(existingCard.synonyms || []), ...newCard.synonyms]));
                 updatedDatabase[matchIndex].synonyms = mergedSynonyms;
            }

        } else {
            // NO MATCH: Add as new card
            updatedDatabase.push(newCard);
        }
    });

    return updatedDatabase;
};
