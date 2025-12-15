export enum Gender {
  Male = 'Masculino',
  Female = 'Feminino',
  Other = 'Outro'
}

export enum ActivityLevel {
  Sedentary = 'Sedentário',
  LightlyActive = 'Levemente Ativo',
  ModeratelyActive = 'Moderadamente Ativo',
  VeryActive = 'Muito Ativo',
  SuperActive = 'Extremamente Ativo'
}

export enum Goal {
  LoseFat = 'Foco em Perda de Gordura',
  BuildMuscle = 'Foco em Ganho Muscular',
  Recomposition = 'Recomposição (Ambos)'
}

export enum Environment {
  Gym = 'Academia',
  Home = 'Em Casa (Peso do corpo/Halteres)'
}

export interface UserProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: Goal;
  environment: Environment;
  restrictions: string; // Dietary or physical restrictions
}

export interface MacroTarget {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface MealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  name: string; // e.g., Breakfast, Lunch
  items: MealItem[];
  totalCalories: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

export interface WorkoutSession {
  dayName: string;
  focus: string; // e.g., "Upper Body", "Legs"
  warmup: string;
  exercises: Exercise[];
  cardio: string;
}

export interface GeneratedPlan {
  summary: string;
  macros: MacroTarget;
  nutritionPlan: Meal[];
  workoutPlan: WorkoutSession[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}