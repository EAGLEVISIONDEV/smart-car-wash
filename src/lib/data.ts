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
  mapsEmbed:
    "https://www.google.com/maps?q=Smart+Car+Wash+Strada+Buze%C8%99ti+34+Bucure%C8%99ti&output=embed",
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
    "Bon fiscal",
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
    imageKey: "foam" as const,
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
    imageKey: "shine" as const,
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
    imageKey: "detail" as const,
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

export const whyUs = [
  {
    title: "8 linii, fără coadă inutilă",
    text: "Capacitate mare pe Buzești — alegi slotul online și vii când e timpul tău.",
  },
  {
    title: "Booking pe număr",
    text: "Introduci numărul de înmatriculare, primești cod, verifici statusul live pe telefon.",
  },
  {
    title: "Lăsare mașină",
    text: "Lași mașina, te ocupi de treburile din zonă, revii când e gata.",
  },
  {
    title: "Detailing & full service",
    text: "De la Express rapid la Detail premium — același loc, același standard.",
  },
] as const;

/** Public Google-style reviews for Buzești location (paraphrased from public listings). */
export const reviews = [
  {
    name: "Andrei M.",
    stars: 5,
    text: "Spălătorie bine organizată, spațiu de așteptare cu AC, atenție la detalii. Recomand.",
  },
  {
    name: "Cristina D.",
    stars: 5,
    text: "Am fost și pentru spălare normală, și pentru detailing. Condiții excelente, angajați dedicați. Dau și bon fiscal.",
  },
  {
    name: "Mihai R.",
    stars: 5,
    text: "Profi băieții. Atenți la detalii, iar express detailing e un raport calitate/preț foarte bun.",
  },
  {
    name: "Ioana P.",
    stars: 5,
    text: "Locație centrală, 8 linii, organizare bună. Poți lăsa mașina și o preiei la ora discutată.",
  },
  {
    name: "Vlad T.",
    stars: 5,
    text: "Personal amabil, prețuri bune. Dimineața era coadă — semn că oamenii revin. Mergi cu încredere.",
  },
  {
    name: "Elena S.",
    stars: 5,
    text: "Full service cu servicii de calitate. Am fost mulțumită de fiecare dată și revin.",
  },
] as const;

export const faqs = [
  {
    q: "Cum programez online?",
    a: "Alegi pachetul (Express, Complet sau Detail), ziua și ora, apoi introduci numărul de înmatriculare și telefonul. Primești un cod de rezervare.",
  },
  {
    q: "Pot verifica statusul mașinii?",
    a: "Da. Pe pagina Status introduci numărul de înmatriculare sau codul și vezi dacă e confirmată, în spălare sau gata de ridicare.",
  },
  {
    q: "Pot lăsa mașina și să revin?",
    a: "Da. Spui la check-in că lași mașina. Te sunăm sau verifici statusul online când e gata.",
  },
  {
    q: "Care e programul?",
    a: "Luni–Duminică, 08:00–20:00. Sloturile online respectă programul și capacitatea pe linii.",
  },
  {
    q: "Acceptați cardul?",
    a: "Da, acceptăm carduri. Se emite și bon fiscal.",
  },
  {
    q: "Unde sunteți exact?",
    a: "Strada Buzești 34, București 011015. Deschizi Google Maps din site sau suni la +40 742 399 889.",
  },
] as const;

const u = (id: string, w = 3840) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=100&fm=jpg`;

export const images = {
  hero: u("photo-1607860108855-64acf2078ed9", 3840),
  foam: u("photo-1609521263047-f8f205293f24", 3840),
  shine: u("photo-1618843479313-40f8afb4b4d8", 3840),
  wet: u("photo-1492144534655-ae79c964c9d7", 3840),
  detail: u("photo-1503376780353-7e6692767b70", 3840),
  interior: u("photo-1485291571150-772bcfc10da5", 3840),
  wash: u("photo-1601362840469-51e4d8d58785", 3840),
  night: u("photo-1494976388531-d1058494cdd8", 3840),
  clean: u("photo-1549317661-bd32c8ce0db2", 3840),
  spray: u("photo-1617531653332-bd46c24f2068", 3840),
  garage: u("photo-1486006920555-c77dcf18193c", 3840),
  red: u("photo-1544636331-e26879cd4d9b", 3840),
  ferrari: u("photo-1583121274602-3e2820c69888", 3840),
  road: u("photo-1449965408869-eaa3f722e40d", 3840),
} as const;

export const gallery = [
  {
    src: images.foam,
    alt: "Spălare auto profesională",
    span: "lg:col-span-2 lg:row-span-2",
    sizes: "(max-width:768px) 100vw, (max-width:1024px) 66vw, 50vw",
  },
  {
    src: images.shine,
    alt: "Finisaj lucios după spălare",
    span: "",
    sizes: "(max-width:768px) 50vw, 25vw",
  },
  {
    src: images.wet,
    alt: "Detaliu caroserie udă",
    span: "",
    sizes: "(max-width:768px) 50vw, 25vw",
  },
  {
    src: images.detail,
    alt: "Mașină premium ready",
    span: "lg:col-span-2",
    sizes: "(max-width:768px) 100vw, (max-width:1024px) 66vw, 50vw",
  },
  {
    src: images.interior,
    alt: "Interior curat",
    span: "",
    sizes: "(max-width:768px) 50vw, 25vw",
  },
  {
    src: images.wash,
    alt: "Proces de spălare",
    span: "",
    sizes: "(max-width:768px) 50vw, 25vw",
  },
  {
    src: images.spray,
    alt: "Curățare cu presiune",
    span: "",
    sizes: "(max-width:768px) 50vw, 25vw",
  },
  {
    src: images.night,
    alt: "Mașină pe asfalt umed",
    span: "lg:col-span-2",
    sizes: "(max-width:768px) 100vw, (max-width:1024px) 66vw, 50vw",
  },
  {
    src: images.red,
    alt: "Mașină sport după detailing",
    span: "",
    sizes: "(max-width:768px) 50vw, 25vw",
  },
  {
    src: images.ferrari,
    alt: "Finisaj showroom",
    span: "lg:col-span-2",
    sizes: "(max-width:768px) 100vw, 50vw",
  },
] as const;
