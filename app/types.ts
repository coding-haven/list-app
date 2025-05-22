export interface RankedItem {
  id: string;
  title: string;
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface RankedList {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  items: RankedItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ListsContextType {
  lists: RankedList[];
  categories: Category[];
  addList: (title: string, description?: string, categoryId?: string) => void;
  updateList: (id: string, updates: Partial<RankedList>) => void;
  deleteList: (id: string) => void;
  addItem: (listId: string, title: string) => void;
  updateItem: (listId: string, itemId: string, updates: Partial<RankedItem>) => void;
  deleteItem: (listId: string, itemId: string) => void;
  reorderItems: (listId: string, items: RankedItem[]) => void;
  importLists: (lists: RankedList[]) => Promise<void>;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
} 