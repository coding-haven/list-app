import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { RankedItem } from '../types';
import { Modal } from './Modal';

interface ItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  item?: RankedItem;
}

export function ItemModal({ visible, onClose, onSave, item }: ItemModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
    } else {
      setTitle('');
    }
  }, [item, visible]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add New Item'}
    >
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter item title"
            autoFocus
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.saveButton, !title.trim() && styles.disabledButton]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>
              {item ? 'Save Changes' : 'Add Item'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
  },
}); 