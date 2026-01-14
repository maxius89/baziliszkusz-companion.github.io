export const CLASSES = {
  magusvadasz: {
    name: 'Mágusvadász',
    bonus: '+1 varázslat',
    effect: { type: 'spells', value: 1 }
  },
  szabotor: {
    name: 'Szabotőr',
    bonus: '+5 Test',
    effect: { type: 'body', value: 5 }
  },
  vereb: {
    name: 'Véreb',
    bonus: '+1 Kecsesség',
    effect: { type: 'skill', value: 1 }
  }
};

export const BACKGROUNDS = {
  testor: {
    name: 'Egy nagyhatalmú mágus testőre',
    bonus: 'Kezdeti felszerelés: Rúnapajzs',
    effect: { type: 'equipment', value: 'Rúnapajzs' }
  },
  ostora: {
    name: 'A Birodalom ellenségeinek ostora',
    bonus: 'Kezdeti felszerelés: 3 Dobókés',
    effect: { type: 'equipment', value: '3× Dobókés' }
  },
  tulelo: {
    name: 'Magiko-technikus kísérletek túlélője',
    bonus: 'Speciális képesség: Áldozz fel 1 Elmepontot, hogy 2 Testpontot gyógyulj',
    effect: { type: 'ability', value: 'Magiko-regeneráció: -1 Elme → +2 Test' }
  }
};

export const SPELLS = {
  ragyogas: { nameText: 'Ragyogás', mindReq: 6 },
  gyorsitas: { nameText: 'Gyorsítás', mindReq: 7 },
  varazslokVegzete: { nameText: 'Varázslók végzete', mindReq: 9 },
  manatuske: { nameText: 'Manatüske', mindReq: 8 },
  izomsorvadas: { nameText: 'Izomsorvadás', mindReq: 9 },
  eterfolyam: { nameText: 'Éterfolyam', mindReq: 8 }
}

export const LETTER_VALUES = {
  'A': 2, 'B': 25, 'C': 3, 'D': 15, 'E': 4, 'F': 19,
  'G': 9, 'H': 24, 'I': 6, 'J': 22, 'K': 5, 'L': 21,
  'M': 1, 'N': 20, 'O': 8, 'P': 17, 'Q': 14, 'R': 11,
  'S': 18, 'T': 13, 'U': 10, 'V': 5, 'W': 9, 'X': 6,
  'Y': 12, 'Z': 7
};