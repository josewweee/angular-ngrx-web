export interface Pokemon {
  abilities: [
    {
      ability: {
        name: string;
        url: string;
      },
      is_hidden: boolean;
      slot: number;
    }
  ]
  base_experience: number;
  height: number;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  name: string;
  order: number;
  species: {
    name: string;
    url: string;
  };
  stats: [
    {
      base_stat: number,
      effort: number,
      stat: {
        name: string,
        url: string
      }
    },
  ];
  types: [
    {
      slot: number,
      type: {
        name: string,
        url: string
      }
    }
  ];
  weight: number;
  gender?: string;
  flavor_text?: {
    flavor_text: string;
  };
  photo?: string;
}
