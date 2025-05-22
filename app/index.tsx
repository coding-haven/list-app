import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ListModal } from './components/ListModal';
import { useLists } from './context/ListsContext';
import { RankedList } from './types';

export default function HomeScreen() {
  const { lists, addList, updateList } = useLists();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingList, setEditingList] = useState<RankedList | undefined>();

  const handleSaveList = (title: string, description: string) => {
    if (editingList) {
      updateList(editingList.id, { title, description });
    } else {
      addList(title, description);
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

  return (
    <View style={styles.container}>
      {lists.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No lists yet</Text>
          <Text style={styles.emptyStateSubtext}>Create your first ranked list!</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {lists.map((list) => (
            <Pressable
              key={list.id}
              style={styles.listItem}
              onLongPress={() => handleEditList(list)}
            >
              <Link href={`/list/${list.id}`} asChild>
                <Pressable style={styles.listContent}>
                  <View>
                    <Text style={styles.listTitle}>{list.title}</Text>
                    {list.description && (
                      <Text style={styles.listDescription}>{list.description}</Text>
                    )}
                    <Text style={styles.listSubtitle}>
                      {list.items.length} items
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#666" />
                </Pressable>
              </Link>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      <ListModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveList}
        list={editingList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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