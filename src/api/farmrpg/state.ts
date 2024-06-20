export interface FarmState {
  id: number;
  field?: {
    rows?: number;
    status?: string;
    plots?: {
      cropName?: string;
      isGrowing: boolean;
      isReady: boolean;
      progress?: number;
    }[];
  };
}

export interface KitchenState {
  status?: string;
  ovens?: {
    itemName?: string;
    canStir?: boolean;
    canTaste?: boolean;
    canSeason?: boolean;
    isCooking: boolean;
    isReady: boolean;
    doneAt?: number;
  }[];
}

export interface TownState {
  status?: string;
  isBorgenOpen?: boolean;
}
