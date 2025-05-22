import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, ListsContextType, RankedItem, RankedList } from '../types';

const STORAGE_KEY = '@list_app_data';
const CATEGORIES_KEY = '@list_app_categories';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'default',
    name: 'Uncategorized',
    color: '#8E8E93',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'favorites',
    name: 'Favorites',
    color: '#FF9500',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'work',
    name: 'Work',
    color: '#007AFF',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#34C759',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<RankedList[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Load data from storage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedLists, storedCategories] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);

      if (storedLists) {
        setLists(JSON.parse(storedLists));
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveLists = async (newLists: RankedList[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const saveCategories = async (newCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const importLists = async (importedLists: RankedList[]) => {
    // Generate new IDs for imported lists and items to avoid conflicts
    const newLists = importedLists.map(list => ({
      ...list,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      items: list.items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setLists(newLists);
    await saveLists(newLists);
  };

  const addList = (title: string, description?: string, categoryId?: string) => {
    const newList: RankedList = {
      id: Date.now().toString(),
      title,
      description,
      categoryId,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newLists = [...lists, newList];
    setLists(newLists);
    saveLists(newLists);
  };

  const updateList = (id: string, updates: Partial<RankedList>) => {
    const newLists = lists.map(list =>
      list.id === id
        ? { ...list, ...updates, updatedAt: new Date().toISOString() }
        : list
    );
    setLists(newLists);
    saveLists(newLists);
  };

  const deleteList = (id: string) => {
    const newLists = lists.filter(list => list.id !== id);
    setLists(newLists);
    saveLists(newLists);
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    saveCategories(newCategories);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const newCategories = categories.map(category =>
      category.id === id
        ? { ...category, ...updates, updatedAt: new Date().toISOString() }
        : category
    );
    setCategories(newCategories);
    saveCategories(newCategories);
  };

  const deleteCategory = (id: string) => {
    // Don't allow deleting the default category
    if (id === 'default') return;

    const newCategories = categories.filter(category => category.id !== id);
    setCategories(newCategories);
    saveCategories(newCategories);

    // Update lists that were using this category
    const newLists = lists.map(list =>
      list.categoryId === id
        ? { ...list, categoryId: 'default', updatedAt: new Date().toISOString() }
        : list
    );
    setLists(newLists);
    saveLists(newLists);
  };

  const addItem = (listId: string, title: string) => {
    const newLists = lists.map(list => {
      if (list.id === listId) {
        const newItem: RankedItem = {
          id: Date.now().toString(),
          title,
          rank: list.items.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          ...list,
          items: [...list.items, newItem],
          updatedAt: new Date().toISOString(),
        };
      }
      return list;
    });
    setLists(newLists);
    saveLists(newLists);
  };

  const updateItem = (listId: string, itemId: string, updates: Partial<RankedItem>) => {
    const newLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item =>
            item.id === itemId
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return list;
    });
    setLists(newLists);
    saveLists(newLists);
  };

  const deleteItem = (listId: string, itemId: string) => {
    const newLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString(),
        };
      }
      return list;
    });
    setLists(newLists);
    saveLists(newLists);
  };

  const reorderItems = (listId: string, items: RankedItem[]) => {
    const newLists = lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: items.map((item, index) => ({
            ...item,
            rank: index,
            updatedAt: new Date().toISOString(),
          })),
          updatedAt: new Date().toISOString(),
        };
      }
      return list;
    });
    setLists(newLists);
    saveLists(newLists);
  };

  return (
    <ListsContext.Provider
      value={{
        lists,
        categories,
        addList,
        updateList,
        deleteList,
        addItem,
        updateItem,
        deleteItem,
        reorderItems,
        importLists,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListsProvider');
  }
  return context;
} 