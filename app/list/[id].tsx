import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ItemModal } from '../components/ItemModal';
import { useLists } from '../context/ListsContext';
import { RankedItem } from '../types';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { lists, reorderItems, addItem, updateItem, deleteItem } = useLists();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<RankedItem | undefined>();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<RankedItem | undefined>();
  
  const list = lists.find(l => l.id === id);
  
  if (!list) {
    return (
      <View style={styles.container}>
        <Text>List not found</Text>
      </View>
    );
  }

  const handleSaveItem = (title: string) => {
    if (editingItem) {
      updateItem(list.id, editingItem.id, { title });
    } else {
      addItem(list.id, title);
    }
  };

  const handleEditItem = (item: RankedItem) => {
    setEditingItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(undefined);
  };

  const handleDeletePress = (item: RankedItem) => {
    setItemToDelete(item);
    setDeleteConfirmationVisible(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteItem(list.id, itemToDelete.id);
      setItemToDelete(undefined);
    }
  };

  const renderItem = ({ item, drag, isActive }: { 
    item: RankedItem; 
    drag: () => void; 
    isActive: boolean;
  }) => {
    return (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          onPress={() => handleEditItem(item)}
          disabled={isActive}
          style={[
            styles.itemContainer,
            isActive && styles.itemContainerActive
          ]}
        >
          <View style={styles.rankContainer}>
            <Text style={styles.rankText}>{item.rank + 1}</Text>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
          <Pressable
            onPress={() => handleDeletePress(item)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </Pressable>
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={list.items.sort((a, b) => a.rank - b.rank)}
        onDragEnd={({ data }) => reorderItems(list.id, data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      <ItemModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={editingItem}
      />

      <ConfirmationModal
        visible={deleteConfirmationVisible}
        onClose={() => {
          setDeleteConfirmationVisible(false);
          setItemToDelete(undefined);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContainerActive: {
    backgroundColor: '#f0f0f0',
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 