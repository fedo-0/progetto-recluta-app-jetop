import dishesData from "../../data/dishes.json";
import restaurantsData from "../../data/restaurants.json";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const restaurant = restaurantsData.restaurants.find((r) => r.id === id);
  const restaurantDishes = dishesData.restaurants.find((r) => r.id === id);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Restaurant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>{"←"}</Text>
          </TouchableOpacity>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.category}>{restaurant.category}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
        </View>
        {restaurantDishes && restaurantDishes.dishes.length > 0 ? (
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Menu</Text>
            {restaurantDishes.dishes.map((category) => (
              <View key={category.category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.category}</Text>
                {category.items.map((item) => (
                  <View key={item.id} style={styles.dishCard}>
                    <View style={styles.dishInfo}>
                      <Text style={styles.dishName}>{item.name}</Text>
                      <Text style={styles.dishDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <Text style={styles.dishPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noMenu}>No menu available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
    marginBottom: 12,
  },
  backText: {
    fontSize: 24,
    color: "#007AFF",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  category: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dishCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dishInfo: {
    flex: 1,
    marginRight: 12,
  },
  dishName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  dishDescription: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  error: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
  noMenu: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
