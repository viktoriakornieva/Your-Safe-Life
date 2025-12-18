// Data for Your Safe Life calculator
// All values are educational and approximate

const INSURANCE_DATA = {
  property: {
    label: "Страхування майна",
    baseRateAnnual: 0.02,
    risks: {
      vehicle: { label: "Автомобіль / транспортні засоби", coef: 2.0 },
      apartment: { label: "Квартира", coef: 0.8 },
      house: { label: "Будинок", coef: 1.1 },
      equipment: { label: "Обладнання", coef: 1.3 },
      goods: { label: "Товар", coef: 1.5 },
      tech: { label: "Техніка", coef: 1.0 }
    },
    options: {
      fire: { label: "Пожежа", price: 1500 },
      flood: { label: "Затоплення", price: 1250 },
      theft: { label: "Крадіжка", price: 1750 },
      disaster: { label: "Стихійні лиха", price: 1500 }
    }
  },

  health: {
    label: "Страхування здоров’я",
    baseRateAnnual: 0.03,
    risks: {
      standard: { label: "Стандартний ризик", coef: 1.0 }
    },
    options: {
      dental: { label: "Стоматологія", price: 3000 },
      hospital: { label: "Стаціонар", price: 2500 },
      telemedicine: { label: "Телемедицина", price: 1000 },
      vaccine: { label: "Вакцинація", price: 1250 }
    }
  },

  travel: {
    label: "Туристичне страхування",
    baseRateAnnual: 0.045,
    risks: {
      basic: { label: "Базове покриття", coef: 0.7 }
    },
    options: {
      sport: { label: "Активний спорт", price: 2500 },
      baggage: { label: "Багаж", price: 1250 },
      cancel: { label: "Скасування поїздки", price: 2250 },
      evacuation: { label: "Медична евакуація", price: 2000 }
    }
  }
};

const FRANCHISE_PERCENT = 2;
