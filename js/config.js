export const CLASSES = {
  magusvadasz: {
    name: 'Mágusvadász',
    bonus: '+1 varázslat',
    effect: { type: 'spells', value: 1 }
  },
  szabotor: {
    name: 'Szabotőr',
    bonus: '+5 Test',
    effect: { type: 'test', value: 5 }
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