export interface SortOption {
  value: string;
  label: string;
}

export interface WishlistEntry {
  id: number;
  dateAdded: string;
}

export interface UserWishlist {
  seller: string;
  products: WishlistEntry[];
}

export interface WishlistData {
  searchPlaceholder: string;
  sortOptions: SortOption[];
  wishlists: UserWishlist[];
}
