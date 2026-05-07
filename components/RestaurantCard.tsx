import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";

type RestaurantCardProps = {
  id: string;
  name: string;
  category: string;
  description: string;
  onPress: (id: string) => void;
};

export default function RestaurantCard({ id, name, category, description, onPress }: RestaurantCardProps) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(id)}>
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
  },
});
