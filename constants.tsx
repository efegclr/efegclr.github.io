
import React from 'react';
import { Drink } from './types';
import { Beer, GlassWater, Wine, Cherry, Martini } from 'lucide-react';

export const DRINK_TYPES: Drink[] = [
  { id: 'beer', name: 'Bira', volume: 500, abv: 5, icon: 'Beer' },
  { id: 'wine', name: 'Şarap', volume: 150, abv: 12, icon: 'Wine' },
  { id: 'rakı', name: 'Rakı/Votka', volume: 40, abv: 45, icon: 'GlassWater' },
  { id: 'gin', name: 'Cin', volume: 40, abv: 40, icon: 'Martini' },
  { id: 'cocktail', name: 'Kokteyl', volume: 200, abv: 15, icon: 'Cherry' }
];

export const GENDER_FACTORS = {
  male: 0.68,
  female: 0.55
};

export const METABOLISM_RATE = 0.15; // Average promil reduction per hour

export const ICON_MAP: Record<string, React.ReactNode> = {
  Beer: <Beer className="w-5 h-5" />,
  Wine: <Wine className="w-5 h-5" />,
  GlassWater: <GlassWater className="w-5 h-5" />,
  Cherry: <Cherry className="w-5 h-5" />,
  Martini: <Martini className="w-5 h-5" />
};
