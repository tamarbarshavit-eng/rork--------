const offensivePatterns = [
  /\bמטומטם/i,
  /\bטיפש/i,
  /\bאידיוט/i,
  /\bמפגר/i,
  /\bשקרן/i,
  /\bרע/i,
  /\bאף פעם לא/i,
  /\bתמיד את/i,
  /\bתמיד אתה/i,
  /\bאשמה שלך/i,
  /\bזו אשמתך/i,
  /\bלא מסוגל/i,
  /\bלא מסוגלת/i,
  /\bאימא גרועה/i,
  /\bאבא גרוע/i,
  /\bהילדים שונאים/i,
  /\bמה קורה איתך/i,
  /\bמה הבעיה שלך/i,
];

const blamingPatterns = [
  /\bבגללך/i,
  /\bאת אשם/i,
  /\bאתה אשם/i,
  /\bזו אשמתך/i,
  /\bהרסת/i,
  /\bלא מתחשב/i,
  /\bלא מתחשבת/i,
  /\bלא אכפת לך/i,
];

const irrelevantPatterns = [
  /\bחבר שלך/i,
  /\bחברה שלך/i,
  /\bהחיים שלך/i,
  /\bמי שאת/i,
  /\bמי שאתה/i,
  /\bהמשפחה שלך/i,
];

export function analyzeMessage(text: string): {
  isOffensive: boolean;
  hasBlaming: boolean;
  isIrrelevant: boolean;
  shouldFilter: boolean;
} {
  const isOffensive = offensivePatterns.some(pattern => pattern.test(text));
  const hasBlaming = blamingPatterns.some(pattern => pattern.test(text));
  const isIrrelevant = irrelevantPatterns.some(pattern => pattern.test(text));
  
  return {
    isOffensive,
    hasBlaming,
    isIrrelevant,
    shouldFilter: isOffensive || hasBlaming || isIrrelevant,
  };
}

export function generateRespectfulVersion(text: string): string {
  const analysis = analyzeMessage(text);
  
  if (!analysis.shouldFilter) {
    return text;
  }

  if (text.includes('אוסף') || text.includes('להחזיר') || text.includes('איסוף')) {
    return 'אשמח לתאם את מועד האיסוף של הילדים. מתי נוח לך?';
  }
  
  if (text.includes('בית ספר') || text.includes('לימודים') || text.includes('מורה')) {
    return 'יש לי עדכון לגבי בית הספר של הילדים. נוכל לדבר על זה?';
  }
  
  if (text.includes('רופא') || text.includes('בריאות') || text.includes('חולה')) {
    return 'אני רוצה לעדכן אותך לגבי נושא בריאותי של הילדים.';
  }
  
  if (text.includes('כסף') || text.includes('תשלום') || text.includes('הוצאות')) {
    return 'אני רוצה לדבר על הוצאות משותפות. אפשר לתאם?';
  }
  
  if (text.includes('סוף שבוע') || text.includes('חופשה') || text.includes('חג')) {
    return 'אשמח לתאם את לוח הזמנים של הילדים לתקופה הקרובה.';
  }

  return 'אשמח לדבר איתך על נושא הקשור לילדים. אפשר לתאם?';
}

export function filterMessage(originalText: string): {
  filteredText: string;
  wasFiltered: boolean;
} {
  const analysis = analyzeMessage(originalText);
  
  if (analysis.shouldFilter) {
    return {
      filteredText: generateRespectfulVersion(originalText),
      wasFiltered: true,
    };
  }
  
  return {
    filteredText: originalText,
    wasFiltered: false,
  };
}
