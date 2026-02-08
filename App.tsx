
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Section } from './components/Section';
import { AiAssistant } from './components/AiAssistant';
import { DRINK_TYPES, GENDER_FACTORS, METABOLISM_RATE, ICON_MAP } from './constants';
import { Gender, DrinkSettings } from './types';
import { AlertCircle, Clock, Weight, User as UserIcon, Plus, Minus, Info, Ruler, Settings2, Droplets } from 'lucide-react';

const App: React.FC = () => {
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [gender, setGender] = useState<Gender>('male');
  const [hours, setHours] = useState<number>(0);
  
  const [drinkSettings, setDrinkSettings] = useState<Record<string, DrinkSettings>>(() => {
    const initial: Record<string, DrinkSettings> = {};
    DRINK_TYPES.forEach(d => {
      initial[d.id] = { count: 0, abv: d.abv, volume: d.volume };
    });
    return initial;
  });

  const [promil, setPromil] = useState<number>(0);

  const calculatePromil = () => {
    let totalAlcoholGrams = 0;
    DRINK_TYPES.forEach(drink => {
      const settings = drinkSettings[drink.id];
      if (settings) {
        // Genellikle içeceklerin yoğunluğu 0.8 (ethanol) olarak alınır
        const gramsPerDrink = settings.volume * (settings.abv / 100) * 0.8;
        totalAlcoholGrams += gramsPerDrink * settings.count;
      }
    });

    const r = GENDER_FACTORS[gender];
    // Widmark Formülü: BAC = (A / (W * r)) - (β * t)
    let result = (totalAlcoholGrams / (weight * r)) - (METABOLISM_RATE * hours);
    setPromil(Math.max(0, result));
  };

  useEffect(() => {
    calculatePromil();
  }, [weight, height, gender, hours, drinkSettings]);

  const updateCount = (id: string, delta: number) => {
    setDrinkSettings(prev => ({
      ...prev,
      [id]: { ...prev[id], count: Math.max(0, prev[id].count + delta) }
    }));
  };

  const updateAbv = (id: string, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setDrinkSettings(prev => ({
        ...prev,
        [id]: { ...prev[id], abv: Math.min(100, Math.max(0, num)) }
      }));
    }
  };

  const updateVolume = (id: string, value: string) => {
    const num = parseInt(value);
    if (!isNaN(num)) {
      setDrinkSettings(prev => ({
        ...prev,
        [id]: { ...prev[id], volume: Math.max(1, num) }
      }));
    }
  };

  const isLegal = promil < 0.50;

  return (
    <Layout>
      <header className="mb-8 pt-[env(safe-area-inset-top)] select-none">
        <h1 className="text-3xl font-bold font-outfit tracking-tight mb-2">
          Promil <span className="text-gray-400">Pro</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Profesyonel alkol analiz ve takip asistanı.
        </p>
      </header>

      <div className="flex flex-col gap-6 mb-24 select-none">
        {/* Sonuç Ekranı */}
        <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center justify-center text-center shadow-xl ${
          promil === 0 ? 'bg-white border-gray-100' :
          isLegal ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Tahmini Seviye</div>
          
          <div className={`text-7xl font-black font-outfit mb-2 tabular-nums tracking-tighter ${
            promil === 0 ? 'text-gray-200' : isLegal ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {promil.toFixed(2)}
          </div>
          
          <div className="text-sm font-bold font-outfit text-gray-400 mb-6">promil</div>
          
          {!isLegal && promil > 0 && (
            <div className="bg-rose-600 text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 animate-pulse">
              <AlertCircle className="w-4 h-4" /> DİREKSİYONA GEÇMEYİN
            </div>
          )}

          <p className="text-xs text-gray-500 leading-relaxed max-w-[240px]">
            {promil === 0 ? "Hesaplama için bilgilerinizi girin." :
             isLegal ? "Yasal sınırın altındasınız, ancak her zaman tedbirli olun." :
             "Alkol seviyeniz güvenli sürüş limitinin üzerindedir."}
          </p>
        </div>

        {/* Girdiler */}
        <div className="space-y-6">
          <Section title="Kişisel Bilgiler" className="mb-0">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 ml-1">
                    <Weight className="w-3 h-3" /> Ağırlık (kg)
                  </label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 ml-1">
                    <Ruler className="w-3 h-3" /> Boy (cm)
                  </label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-black outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 ml-1">
                  <UserIcon className="w-3 h-3" /> Cinsiyet
                </label>
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                        gender === g ? 'bg-black text-white border-black shadow-md' : 'bg-gray-50 text-gray-400 border-transparent'
                      }`}
                    >
                      {g === 'male' ? 'Erkek' : 'Kadın'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> İlk alkolü kaç saat önce içtiniz?
                  </label>
                  <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded-lg">{hours} sa</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="12" 
                  step="0.5"
                  value={hours} 
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                  className="w-full accent-black h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </Section>

          <Section title="İçecekler ve Ayarlar" className="mb-0">
            <div className="grid grid-cols-1 gap-3">
              {DRINK_TYPES.map(drink => (
                <div key={drink.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                      {ICON_MAP[drink.icon]}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{drink.name}</div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                          <span className="text-[9px] font-bold text-gray-300">%</span>
                          <input 
                            type="number"
                            value={drinkSettings[drink.id].abv}
                            onChange={(e) => updateAbv(drink.id, e.target.value)}
                            className="w-7 bg-transparent border-none p-0 text-xs font-bold focus:ring-0 text-gray-500"
                          />
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                          <input 
                            type="number"
                            value={drinkSettings[drink.id].volume}
                            onChange={(e) => updateVolume(drink.id, e.target.value)}
                            className="w-10 bg-transparent border-none p-0 text-right text-xs font-bold focus:ring-0 text-gray-500"
                          />
                          <span className="text-[9px] font-bold text-gray-300">ml</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl p-1.5">
                    <button 
                      onClick={() => updateCount(drink.id, -1)} 
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-colors active:scale-90"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-base font-black font-outfit w-4 text-center">{drinkSettings[drink.id].count}</span>
                    <button 
                      onClick={() => updateCount(drink.id, 1)} 
                      className="w-9 h-9 flex items-center justify-center hover:bg-gray-800 rounded-xl transition-colors active:scale-90"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <div className="p-5 border border-gray-100 rounded-3xl bg-white shadow-sm flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-[10px] text-gray-400 leading-relaxed font-medium">
            <strong>BİLGİLENDİRME:</strong> Bu uygulama bilimsel Widmark formülünü temel alır. Ancak cinsiyet, yaş, metabolizma hızı ve mide doluluğu gibi faktörler sonucu etkiler. Bu veriler sadece bilgilendirme amaçlıdır; asla yasal bir kanıt veya güvenlik garantisi olarak kullanılamaz.
          </div>
        </div>
      </div>

      <AiAssistant />
      <div className="h-[env(safe-area-inset-bottom)] pb-8"></div>
    </Layout>
  );
};

export default App;
