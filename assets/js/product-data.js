const products = [
  // Excipients Category
  // Superdisintegrants & Disintegrants
  // Excipients Category
  // Superdisintegrants & Disintegrants
  {
    id: "parcros",
    title: "Croscarmellose Sodium",
    image: "../assets/images/products/photography/croscarmellosesodium/image-1.jpg",
    category: "Excipients",
    subcategory: "Superdisintegrants & Disintegrants"
  },
  {
    id: "calopar",
    title: "Carboxymethyl Cellulose Calcium",
    image: "../assets/images/products/photography/calciumcarboxymethylcellulose/image-1.jpg",
    category: "Excipients",
    subcategory: "Superdisintegrants & Disintegrants"
  },
  {
    id: "pargel",
    title: "Sodium Starch Glycolate",
    image: "../assets/images/products/photography/sodiumstarchglycolate/image-1.jpg",
    category: "Excipients",
    subcategory: "Superdisintegrants & Disintegrants"
  },
  {
    id: "parone",
    title: "Crospovidone",
    image: "../assets/images/products/photography/crospovidone/image-1.jpg",
    category: "Excipients",
    subcategory: "Superdisintegrants & Disintegrants"
  },
  // Binders & Fillers
  {
    id: "parlose",
    title: "Microcrystalline Cellulose",
    image: "../assets/images/products/photography/microcrystallinecellulose/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "sodiumcmc",
    title: "Sodium Carboxymethyl Cellulose",
    image: "../assets/images/products/photography/sodiumcarboxymethylcellulose/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "carbopar",
    title: "Calcium Carbonate",
    image: "../assets/images/products/photography/sodiumstarchglycolate/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "povidone",
    title: "Povidone",
    image: "../assets/images/products/photography/povidone/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "pregelatinizedstarch",
    title: "Pregelatinized Starch",
    image: "../assets/images/products/photography/magnesiumstearate/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  // Binders & Fillers Additional
  {
    id: "disodiumedetate",
    title: "Di Sodium Edetate",
    image: "../assets/images/products/photography/mcc+cmc/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "starch",
    title: "Starch",
    image: "../assets/images/products/photography/magnesiumstearate/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "talc",
    title: "Talc",
    image: "../assets/images/products/photography/mcc+cmc/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  {
    id: "mannitol",
    title: "Mannitol",
    image: "../assets/images/products/photography/microcrystallinecellulose/image-1.jpg",
    category: "Excipients",
    subcategory: "Binders & Fillers"
  },
  // Lubricants
  {
    id: "parmeg",
    title: "Magnesium Stearate",
    image: "../assets/images/products/photography/magnesiumstearate/image-1.jpg",
    category: "Excipients",
    subcategory: "Lubricants"
  },
  {
    id: 11,
    title: "Sodium Stearyl Fumarate",
    image: "../assets/images/products/photography/sodiumstarchglycolate/image-1.jpg",
    category: "Excipients",
    subcategory: "Lubricants"
  },
  {
    id: "calciumstearate",
    title: "Calcium Stearate",
    image: "../assets/images/products/photography/sodiumstarchglycolate/image-1.jpg",
    category: "Excipients",
    subcategory: "Lubricants"
  },
  {
    id: "stearicacidpowder",
    title: "Stearic Acid Powder",
    image: "../assets/images/products/photography/stearicacidpowder/image-1.jpg",
    category: "Excipients",
    subcategory: "Lubricants"
  },
  // Stabilizers & Thickening Agents
  {
    id: "mcccmc",
    title: "MCC + CMC",
    image: "../assets/images/products/photography/mcc+cmc/image-1.jpg",
    category: "Excipients",
    subcategory: "Stabilizers & Thickening Agents"
  },
  {
    id: "hydroxpropylmethylcellulose",
    title: "Hydroxypropyl Methylcellulose",
    image: "../assets/images/products/photography/crospovidone/image-1.jpg",
    category: "Excipients",
    subcategory: "Stabilizers & Thickening Agents"
  },
  {
    id: "xanthangum",
    title: "Xanthan Gum",
    image: "../assets/images/products/photography/xanthangum/image-1.jpg",
    category: "Excipients",
    subcategory: "Stabilizers & Thickening Agents"
  },
  // {
  //   id: 29,
  //   title: "Hydroxyethyl Cellulose",
  //   image: "assets/images/products/2.jpg",
  //   category: "Excipients",
  //   subcategory: "Stabilizers & Thickening Agents"
  // },
  // Food & Nutra Supplements (moved under Excipients)
  {
    id: "calphos",
    title: "Dibasic Calcium Phosphate",
    image: "../assets/images/products/photography/dibasiccalciumphosphate/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
  {
    id: "calciumcitrate",
    title: "Calcium Citrate",
    image: "../assets/images/products/photography/calciumcitrate/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
  {
    id: "calcitratemalate",
    title: "Calcium Citrate Malate",
    image: "../assets/images/products/photography/mcc+cmc/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
  {
    id: "potcitrate",
    title: "Potassium Citrate",
    image: "../assets/images/products/photography/microcrystallinecellulose/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
  {
    id: "magcitrate",
    title: "Magnesium Citrate",
    image: "../assets/images/products/photography/crospovidone/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
{
  id: "potasiummagnesiumcitrate",
    title: "Potassium Magnesium Citrate",
    image: "../assets/images/products/photography/microcrystallinecellulose/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },

  {
    id: "magnesiumtaurate",
    title: "Magnesium Taurate",
    image: "../assets/images/products/photography/crospovidone/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
  {
    id: "magnesiumglycinate",
    title: "Magnesium Glycinate",
    image: "../assets/images/products/photography/magnesiumglycinate/image-1.jpg",
    category: "Excipients",
    subcategory: "Food & Nutra Supplements"
  },
  // {
  //   id: 36,
  //   title: "Lactose",
  //   image: "assets/images/products/6.jpg",
  //   category: "Excipients",
  //   subcategory: "Food & Nutra Supplements"
  // },
  // API Category
  {
    id: "amiodaronehydrochloride",
    title: "Amiodarone Hydrochloride",
    image: "../assets/images/products/photography/sodiumstarchglycolate/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "API"
  },
  {
    id: "adapalene",
    title: "Adapalene",
    image: "../assets/images/products/photography/mcc+cmc/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "API"
  },
  {
    id: "acylovir",
    title: "Acyclovir",
    image: "../assets/images/products/photography/magnesiumstearate/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "API"
  },
  {
    id: "itopride",
    title: "Itopride",
    image: "../assets/images/products/photography/microcrystallinecellulose/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "API"
  },
  {
    id: "minoxidil",
    title: "Minoxidil",
    image: "../assets/images/products/photography/crospovidone/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "API"
  },
  // Intermediates
  // {
  //   id: 19,
  //   title: "Ethyl 2-chloro-2-(2-(4-methoxyphenyl)hydrazono)acetate Norms",
  //   image: "assets/images/products/1.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: 20,
  //   title: "1-(30methyl-1-phenyl-1H-pyrazol-5-yl)piperazine",
  //   image: "assets/images/products/2.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: 40,
  //   title: "Di Methyl-3- Isobutylpentanedioate (DID)",
  //   image: "assets/images/products/4.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: 41,
  //   title: "Trans 4-Aminocyclohexanol",
  //   image: "assets/images/products/4.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: "10methoxyiminostillbene",
  //   title: "10 Methoxy – Iminostillbene",
  //   image: "assets/images/products/4.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: "2nbutylbenzofuran",
  //   title: "2n Butyl Benzofuran",
  //   image: "assets/images/products/4.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: "2butylbenzofuran",
  //   title: "2-Butyl-3-(3,5-Diiodo-4-hydroxybenzoyl) Benzofuran",
  //   image: "assets/images/products/4.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // {
  //   id: "2nbutylbenzofuran3yl",
  //   title: "(2-Butylbenzofuran-3-yl)(4-hydroxyphenyl) Methanone",
  //   image: "assets/images/products/4.jpg",
  //   category: "API, Intermediates & Vitamins",
  //   subcategory: "Intermediates"
  // },
  // Vitamins
  {
    id: "thiamine",
    title: "Thiamine (Vitamin B1)",
    image: "../assets/images/products/photography/sodiumstarchglycolate/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "Vitamins"
  },
  {
    id: "riboflavin",
    title: "Riboflavin (Vitamin B2)",
    image: "../assets/images/products/photography/mcc+cmc/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "Vitamins"
  },
  {
    id: "pyridoxine",
    title: "Pyridoxine (Vitamin B6)",
    image: "../assets/images/products/photography/magnesiumstearate/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "Vitamins"
  },
  {
    id: "methylcobalamin",
    title: "Methylcobalamin (Vitamin B12)",
    image: "../assets/images/products/photography/microcrystallinecellulose/image-1.jpg",
    category: "API, Intermediates & Vitamins",
    subcategory: "Vitamins"
  }
];

// Export the products array
export { products };