export const business = {
  name: "Smart Car Wash",
  shortName: "SMART CAR WASH",
  tagline: "Spălare inteligentă. Programare rapidă.",
  description:
    "Spălătorie auto modernă pe Strada Buzești 34, București — exterior, interior, detailing. Programează online cu numărul de înmatriculare.",
  phone: "+40742399889",
  phoneDisplay: "+40 742 399 889",
  phoneAlt: "+40721700709",
  address: {
    line1: "Strada Buzești 34",
    city: "București",
    postal: "011015",
    full: "Strada Buzești 34, București 011015",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Smart+Car+Wash+Strada+Buzești+34+București",
  mapsShareUrl: "https://share.google/J8dv9B2NdLBbcYOZ6",
  rating: 4.5,
  reviewCount: 557,
  hours: [{ days: "Luni – Duminică", time: "08:00 – 20:00" }],
  openHour: 8,
  closeHour: 20,
  lanes: 8,
  slotMinutes: 30,
  amenities: [
    "8 linii de lucru",
    "Detailing",
    "Lăsare mașină",
    "Carduri acceptate",
    "Zonă așteptare",
  ],
} as const;

export const packages = [
  {
    id: "express",
    name: "Express",
    subtitle: "Spălare rapidă",
    durationMin: 30,
    description:
      "Exterior cu spumă activă, clătire, uscare și jante — ideal când ai puțin timp.",
    features: ["Spumă activă", "Presiune înaltă", "Uscare", "Jante"],
    accent: false,
  },
  {
    id: "complet",
    name: "Complet",
    subtitle: "Exterior + interior",
    durationMin: 60,
    description:
      "Pachetul cel mai cerut: exterior impecabil plus aspirare, plasticuri și geamuri.",
    features: [
      "Tot din Express",
      "Aspirare completă",
      "Plasticuri & bord",
      "Geamuri interior",
    ],
    accent: true,
  },
  {
    id: "detail",
    name: "Detail",
    subtitle: "Curățare aprofundată",
    durationMin: 90,
    description:
      "Detailing manual pentru un finisaj de showroom — exterior și interior la nivel premium.",
    features: [
      "Tot din Complet",
      "Detailing manual",
      "Degresare",
      "Finisaj premium",
    ],
    accent: false,
  },
] as const;

export type PackageId = (typeof packages)[number]["id"];

export const processSteps = [
  {
    step: "01",
    title: "Programezi",
    text: "Alegi pachetul, ora și introduci numărul de înmatriculare — online, în sub 1 minut.",
  },
  {
    step: "02",
    title: "Ajungi",
    text: "Pe Buzești 34. Spunem numărul sau codul de rezervare — check-in rapid.",
  },
  {
    step: "03",
    title: "Spălăm",
    text: "Până la 8 linii active. Poți aștepta pe loc sau lași mașina și revii.",
  },
  {
    step: "04",
    title: "Ridici",
    text: "Status live pe site după număr. Când e gata, pleci strălucind.",
  },
] as const;

const u = (id: string, w = 2400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=90&fm=jpg`;

export const images = {
  hero: u("photo-1607860108855-64acf2078ed9", 2800),
  foam: u("photo-1558618666-fcd25c85f82e", 2400),
  shine: u("photo-1618843479313-40f8afb4b4d8", 2400),
  wet: u("photo-1492144534655-ae79c964c9d7", 2400),
  detail: u("photo-1503376780353-7e6692767b70", 2400),
  interior: u("photo-1485291571150-772bcfc10da5", 2400),
} as const;
