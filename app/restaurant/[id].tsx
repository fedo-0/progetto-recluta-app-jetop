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
import { useOrder } from "../../contexts/OrderContext";
import MenuItemCard from "../../components/MenuItemCard";

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { order, addItem, updateQuantity, itemCount } = useOrder();

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
                {category.items.map((item) => {
                  const qty =
                    order?.items.find((i) => i.dishId === item.id)?.quantity ??
                    0;
                  return (
                    <MenuItemCard
                      key={item.id}
                      dishId={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      quantity={qty}
                      onAdd={() =>
                        addItem(restaurant.id, restaurant.name, {
                          dishId: item.id,
                          name: item.name,
                          price: item.price,
                        })
                      }
                      onRemove={() =>
                        updateQuantity(item.id, qty - 1)
                      }
                    />
                  );
                })}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noMenu}>No menu available</Text>
        )}
      </ScrollView>
      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.cartBarText}>
            View Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
          </Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 10,
  },
  cartBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cartBarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
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
