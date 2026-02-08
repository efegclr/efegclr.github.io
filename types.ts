
export type Gender = 'male' | 'female';

export interface Drink {
  id: string;
  name: string;
  volume: number; // in ml
  abv: number; // default alcohol by volume percentage
  icon: string;
}

export interface DrinkSettings {
  count: number;
  abv: number;
  volume: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
