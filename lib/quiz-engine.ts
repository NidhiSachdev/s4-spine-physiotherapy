import type { Treatment } from "@/lib/types";

export interface QuizAnswers {
  1: string;
  2: string;
  3: string;
  4: string;
  5: number;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
}

export interface QuizResult {
  treatment: Treatment;
  matchScore: number;
  reasons: string[];
}

const BODY_PART_ALIASES: Record<string, string[]> = {
  wrist: ["wrist", "hand"],
  ankle: ["ankle", "foot"],
  chest: ["core"],
};

function getBodyPartMatches(quizBodyPart: string): string[] {
  return BODY_PART_ALIASES[quizBodyPart] ?? [quizBodyPart];
}

function mapAgeGroup(ageAnswer: string): string {
  switch (ageAnswer) {
    case "under-18":
      return "Child";
    case "18-30":
    case "31-50":
      return "Adult";
    case "51-65":
    case "over-65":
      return "Geriatric";
    default:
      return "Adult";
  }
}

export function calculateResults(
  answers: QuizAnswers,
  treatments: Treatment[]
): QuizResult[] {
  const bodyPart = answers[1];
  const bodyPartMatches = getBodyPartMatches(bodyPart);
  const ageGroup = mapAgeGroup(answers[7]);
  const goal = answers[9];
  const activityLevel = answers[8];
  const painLevel = answers[5];
  const hasPreviousInjury = answers[6] === "yes";

  const scored: { treatment: Treatment; score: number; reasons: string[] }[] = [];

  for (const treatment of treatments) {
    let score = 0;
    const reasons: string[] = [];

    const bodyPartMatch = treatment.bodyParts.some((bp) =>
      bodyPartMatches.includes(bp)
    );
    if (bodyPartMatch) {
      score += 40;
      reasons.push(`Matches your ${bodyPart.replace(/-/g, " ")} pain area`);
    }

    if (treatment.ageGroup.includes(ageGroup)) {
      score += 15;
      reasons.push(`Suitable for your age group`);
    }

    if (goal === "pain-relief" && treatment.conditions.some((c) => c.toLowerCase().includes("pain"))) {
      score += 15;
      reasons.push(`Targets pain relief`);
    } else if (goal === "mobility" && (treatment.ageGroup.includes("Geriatric") || treatment.category === "musculoskeletal")) {
      score += 15;
      reasons.push(`Supports improved mobility`);
    } else if (goal === "return-sport" && treatment.category === "sports-rehabilitation") {
      score += 15;
      reasons.push(`Designed for return to sport`);
    } else if (goal === "post-surgery" && treatment.category === "post-surgical") {
      score += 15;
      reasons.push(`Supports post-surgery recovery`);
    } else if ((goal === "prevention" || goal === "wellness") && treatment.intensity === "Low") {
      score += 15;
      reasons.push(`Gentle approach for prevention and wellness`);
    }

    if (activityLevel === "athlete" || activityLevel === "very-active") {
      if (treatment.category === "sports-rehabilitation") {
        score += 10;
        reasons.push(`Fits your active lifestyle`);
      }
    } else if (activityLevel === "sedentary") {
      if (treatment.treatmentType.includes("Exercise-based")) {
        score += 10;
        reasons.push(`Exercise-based approach for sedentary lifestyle`);
      }
    } else {
      score += 5;
    }

    if (painLevel >= 7 && treatment.intensity === "High") {
      score += 10;
      reasons.push(`Intensive approach for severe pain`);
    } else if (painLevel >= 4 && painLevel <= 6 && treatment.intensity === "Moderate") {
      score += 10;
      reasons.push(`Moderate intensity for your pain level`);
    } else if (painLevel <= 3 && treatment.intensity === "Low") {
      score += 10;
      reasons.push(`Gentle approach for mild pain`);
    }

    if (hasPreviousInjury && treatment.category === "post-surgical") {
      score += 10;
      reasons.push(`Supports post-injury recovery`);
    }
    if (hasPreviousInjury && bodyPartMatch) {
      score += 5;
      reasons.push(`Addresses your previous injury in this area`);
    }

    scored.push({
      treatment,
      score: Math.min(100, score),
      reasons: reasons.slice(0, 3),
    });
  }

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ treatment, score, reasons }) => ({
      treatment,
      matchScore: score,
      reasons: reasons.length > 0 ? reasons : ["Matches your profile"],
    }));
}
