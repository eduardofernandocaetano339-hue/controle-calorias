export interface FoodItem {
  name: string;
  portion_estimate: string;
  calories: number;
  confidence_score: number; // 0 to 1
  macronutrients?: {
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface AnalysisResponse {
  step_by_step_reasoning: string[];
  food_items: FoodItem[];
  total_calories: number;
  overall_confidence: number; // 0 to 1
  uncertainty_factors: string[];
  health_tips: string[];
}

export interface AppState {
  imageUri: string | null;
  isAnalyzing: boolean;
  result: AnalysisResponse | null;
  error: string | null;
}
