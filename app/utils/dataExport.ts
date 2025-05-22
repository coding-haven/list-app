import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { RankedList } from '../types';

const BACKUP_FILENAME = 'ranked-lists-backup.json';

export async function exportData(lists: RankedList[]): Promise<void> {
  try {
    // Create a JSON string of the data
    const jsonData = JSON.stringify(lists, null, 2);
    
    // Get the document directory path
    const directoryUri = FileSystem.documentDirectory;
    if (!directoryUri) {
      throw new Error('Could not access document directory');
    }

    // Create the full file path
    const fileUri = `${directoryUri}${BACKUP_FILENAME}`;

    // Write the data to a file
    await FileSystem.writeAsStringAsync(fileUri, jsonData);

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    // Share the file using expo-sharing
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Ranked Lists',
      UTI: 'public.json'
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

export async function importData(): Promise<RankedList[]> {
  try {
    // Pick a JSON file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });

    if (result.canceled) {
      throw new Error('Import cancelled');
    }

    // Read the file content
    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
    
    // Parse the JSON data
    const importedData = JSON.parse(fileContent) as RankedList[];

    // Validate the imported data
    if (!Array.isArray(importedData)) {
      throw new Error('Invalid data format: expected an array of lists');
    }

    // Basic validation of the imported lists
    importedData.forEach((list, index) => {
      if (!list.id || !list.title || !Array.isArray(list.items)) {
        throw new Error(`Invalid list format at index ${index}`);
      }
    });

    return importedData;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
} 