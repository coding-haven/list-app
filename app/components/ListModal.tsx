import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLists } from '../context/ListsContext';
import { RankedList } from '../types';
import { CategoryModal } from './CategoryModal';
import { Modal } from './Modal';

interface ListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description?: string, categoryId?: string) => void;
  list?: RankedList;
}

export function ListModal({
  visible,
  onClose,
  onSave,
  list,
}: ListModalProps) {
  const { categories } = useLists();
  const [title, setTitle] = useState(list?.title ?? '');
  const [description, setDescription] = useState(list?.description ?? '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(list?.categoryId);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), description.trim() || undefined, selectedCategoryId);
      onClose();
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        title={list ? 'Edit List' : 'New List'}
      >
        <View style={styles.container}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="List title"
            autoFocus
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="List description"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            <Pressable
              style={[
                styles.categoryButton,
                selectedCategory && { backgroundColor: selectedCategory.color + '20' },
              ]}
              onPress={() => setCategoryModalVisible(true)}
            >
              <View style={styles.categoryContent}>
                {selectedCategory ? (
                  <>
                    <View
                      style={[
                        styles.categoryColor,
                        { backgroundColor: selectedCategory.color },
                      ]}
                    />
                    <Text style={styles.categoryName}>{selectedCategory.name}</Text>
                  </>
                ) : (
                  <Text style={styles.categoryPlaceholder}>Select a category</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={!title.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={(name, color) => {
          // Handle category selection
          const category = categories.find(c => c.name === name && c.color === color);
          if (category) {
            setSelectedCategoryId(category.id);
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#000',
  },
  categoryPlaceholder: {
    fontSize: 16,
    color: '#8E8E93',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 