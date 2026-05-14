import SearchBar from "@/components/SearchBar";
import RestaurantCard from "@/components/RestaurantCard";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import restaurantsData from "../../data/restaurants.json" with { type: "json" };

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const restaurants = restaurantsData.restaurants;
  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return restaurants;
    }

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.category, restaurant.description].some(
        (value) => value.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [restaurants, searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Restaurants</Text>
          <Text style={styles.subtitle}>Browse available restaurants</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.profileButtonText}>👤</Text>
        </TouchableOpacity>
      </View>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <ScrollView contentContainerStyle={styles.list}>
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              category={restaurant.category}
              description={restaurant.description}
              onPress={(id) => router.push({ pathname: "/restaurant/[id]", params: { id } })}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No restaurants found</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    color: "#888",
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  profileButtonText: {
    fontSize: 20,
  },
});
