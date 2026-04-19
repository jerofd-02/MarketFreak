export interface FilterOption {
  id: string;
  label?: string;
  separator?: boolean;
}

export interface FilterRange {
  min: number;
  max: number;
}

export interface Filter {
  id: string;
  title: string;
  options?: FilterOption[];
  range?: FilterRange;
}

export interface SearchProductData {
  filters: Filter[];
}
