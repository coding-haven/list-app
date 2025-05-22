import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Category } from '../types';
import { Modal } from './Modal';

const PRESET_COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#007AFF', // Blue
  '#5856D6', // Indigo
  '#AF52DE', // Purple
  '#FF2D55', // Pink
  '#8E8E93', // Gray
];

// Helper function to convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  category?: Category;
}

export function CategoryModal({
  visible,
  onClose,
  onSave,
  category,
}: CategoryModalProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [selectedColor, setSelectedColor] = useState(category?.color ?? PRESET_COLORS[0]);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);
  const [showCustomColor, setShowCustomColor] = useState(false);

  // Update hex color when HSL values change
  React.useEffect(() => {
    if (showCustomColor) {
      setSelectedColor(hslToHex(hue, saturation, lightness));
    }
  }, [hue, saturation, lightness, showCustomColor]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), selectedColor);
      onClose();
    }
  };

  const handlePresetColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowCustomColor(false);
  };

  const handleCustomColorPress = () => {
    setShowCustomColor(true);
    // Convert current hex to HSL for initial values
    // This is a simplified conversion - you might want to use a more robust solution
    const r = parseInt(selectedColor.slice(1, 3), 16) / 255;
    const g = parseInt(selectedColor.slice(3, 5), 16) / 255;
    const b = parseInt(selectedColor.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
    const h = max === min ? 0 :
      max === r ? ((g - b) / (max - min)) * 60 :
      max === g ? ((b - r) / (max - min) + 2) * 60 :
      ((r - g) / (max - min) + 4) * 60;
    
    setHue(h < 0 ? h + 360 : h);
    setSaturation(s * 100);
    setLightness(l * 100);
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={category ? 'Edit Category' : 'New Category'}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Category name"
          autoFocus
        />

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorSection}>
          <View style={styles.presetColors}>
            {PRESET_COLORS.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && !showCustomColor && styles.selectedColor,
                ]}
                onPress={() => handlePresetColorSelect(color)}
              />
            ))}
            <Pressable
              style={[
                styles.colorOption,
                styles.customColorOption,
                showCustomColor && styles.selectedColor,
              ]}
              onPress={handleCustomColorPress}
            >
              <Text style={styles.customColorText}>+</Text>
            </Pressable>
          </View>

          {showCustomColor && (
            <View style={styles.customColorPicker}>
              <View style={styles.colorPreview}>
                <View style={[styles.colorPreviewBox, { backgroundColor: selectedColor }]} />
                <Text style={styles.colorHex}>{selectedColor.toUpperCase()}</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Hue</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={360}
                  value={hue}
                  onValueChange={setHue}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#E5E5EA"
                  thumbTintColor="#007AFF"
                />
              </View>

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Saturation</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={saturation}
                  onValueChange={setSaturation}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#E5E5EA"
                  thumbTintColor="#007AFF"
                />
              </View>

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Lightness</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  value={lightness}
                  onValueChange={setLightness}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#E5E5EA"
                  thumbTintColor="#007AFF"
                />
              </View>
            </View>
          )}
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
            disabled={!name.trim()}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  colorSection: {
    gap: 16,
  },
  presetColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  customColorOption: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customColorText: {
    fontSize: 24,
    color: '#007AFF',
  },
  customColorPicker: {
    gap: 12,
    padding: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  colorPreviewBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorHex: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  sliderContainer: {
    gap: 4,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
  },
  slider: {
    width: '100%',
    height: 40,
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