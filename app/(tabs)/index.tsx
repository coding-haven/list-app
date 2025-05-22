import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CategoryModal } from '../components/CategoryModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { DataModal } from '../components/DataModal';
import { ListModal } from '../components/ListModal';
import { useLists } from '../context/ListsContext';
import { Category, RankedList } from '../types';

export default function ListsScreen() {
  const router = useRouter();
  const { lists, categories, addList, updateList, deleteList, importLists, addCategory, updateCategory, deleteCategory } = useLists();
  const [modalVisible, setModalVisible] = useState(false);
  const [dataModalVisible, setDataModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<RankedList | undefined>();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState<RankedList | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const handleSaveList = (title: string, description?: string, categoryId?: string) => {
    if (editingList) {
      updateList(editingList.id, { title, description, categoryId });
    } else {
      addList(title, description, categoryId);
    }
  };

  const handleEditList = (list: RankedList) => {
    setEditingList(list);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingList(undefined);
  };

  const handleDeletePress = (list: RankedList) => {
    setListToDelete(list);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = () => {
    if (listToDelete) {
      deleteList(listToDelete.id);
      setListToDelete(undefined);
    }
  };

  const handleImport = async (importedLists: RankedList[]) => {
    await importLists(importedLists);
  };

  const handleSaveCategory = (name: string, color: string) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, color });
    } else {
      addCategory(name, color);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalVisible(true);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalVisible(false);
    setEditingCategory(undefined);
  };

  // Filter lists based on search query and selected category
  const filteredLists = lists.filter(list => {
    const matchesSearch = list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategoryId || list.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable
          style={[
            styles.categoryChip,
            !selectedCategoryId && styles.categoryChipSelected,
          ]}
          onPress={() => setSelectedCategoryId(undefined)}
        >
          <Text style={[
            styles.categoryChipText,
            !selectedCategoryId && styles.categoryChipTextSelected,
          ]}>All</Text>
        </Pressable>
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryChip,
              { backgroundColor: category.color + '20' },
              selectedCategoryId === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategoryId(category.id)}
          >
            <View style={[styles.categoryChipColor, { backgroundColor: category.color }]} />
            <Text style={[
              styles.categoryChipText,
              { color: category.color },
              selectedCategoryId === category.id && styles.categoryChipTextSelected,
            ]}>{category.name}</Text>
          </Pressable>
        ))}
        <Pressable
          style={[styles.categoryChip, styles.addCategoryChip]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#007AFF" />
        </Pressable>
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: { item: RankedList }) => {
    const category = categories.find(c => c.id === item.categoryId);
    return (
      <Pressable
        style={[
          styles.listItem,
          category && { borderLeftColor: category.color, borderLeftWidth: 4 },
        ]}
        onPress={() => router.push(`/list/${item.id}`)}
      >
        <View style={styles.listContent}>
          <Text style={styles.listTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.listDescription}>{item.description}</Text>
          )}
          <View style={styles.listMeta}>
            {category && (
              <View style={styles.categoryTag}>
                <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            )}
            <Text style={styles.itemCount}>
              {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
        <View style={styles.listActions}>
          <Pressable
            onPress={() => handleEditList(item)}
            style={styles.actionButton}
          >
            <Ionicons name="pencil-outline" size={20} color="#007AFF" />
          </Pressable>
          <Pressable
            onPress={() => handleDeletePress(item)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search lists..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </Pressable>
        ) : null}
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={filteredLists}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.fabContainer}>
        <Pressable
          style={[styles.fab, styles.dataFab]}
          onPress={() => setDataModalVisible(true)}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
        </Pressable>

        <Pressable
          style={[styles.fab, styles.addFab]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>

      <ListModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveList}
        list={editingList}
      />

      <DataModal
        visible={dataModalVisible}
        onClose={() => setDataModalVisible(false)}
        onImport={handleImport}
        lists={lists}
      />

      <CategoryModal
        visible={categoryModalVisible}
        onClose={handleCloseCategoryModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <ConfirmationModal
        visible={deleteConfirmationVisible}
        onClose={() => {
          setDeleteConfirmationVisible(false);
          setListToDelete(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete List"
        message={`Are you sure you want to delete "${listToDelete?.title}"? This will also delete all items in the list. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        destructive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  categoryFilter: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: '#F2F2F7',
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
  },
  categoryChipColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: 'white',
  },
  addCategoryChip: {
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
  },
  itemCount: {
    fontSize: 14,
    color: '#007AFF',
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    gap: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addFab: {
    backgroundColor: '#007AFF',
  },
  dataFab: {
    backgroundColor: '#34C759',
  },
});
