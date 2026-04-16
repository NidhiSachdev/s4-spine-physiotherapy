export interface TreatmentStep {
  title: string;
  description: string;
}

export interface Treatment {
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  description: string;
  overview: string;
  steps: TreatmentStep[];
  duration: string;
  sessions: string;
  recoveryTime: string;
  intensity: "Low" | "Moderate" | "High";
  ageGroup: string[];
  treatmentType: string[];
  bodyParts: string[];
  conditions: string[];
  relatedSlugs: string[];
  videoPath: string | null;
  imagePath: string | null;
  popularity: number;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  gradient: string;
  treatmentCount: number;
}
