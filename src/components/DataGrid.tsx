import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface DataItem {
  label: string;
  value: string;
  unit?: string;
}

interface DataGridProps {
  title: string;
  data: DataItem[];
  columns?: number;
}

const DataGrid: React.FC<DataGridProps> = ({
  title,
  data,
  columns = 2
}) => {
  const itemWidth = (width - 80) / columns;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>
        {data.map((item, index) => (
          <View key={index} style={[styles.item, { width: itemWidth }]}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>
              {item.value}{item.unit && ` ${item.unit}`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DataGrid;
