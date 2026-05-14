import SearchBar from "@/components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrder } from "../../contexts/OrderContext";
import dishesData from "../../data/dishes.json" with { type: "json" };
import restaurantsData from "../../data/restaurants.json" with { type: "json" };

const RECENT_KEYWORDS = ["Burger", "Sandwich", "Pizza", "Kebab", "Pasta"];

const RESTAURANT_IMAGES: Record<string, string> = {
  "halal-lab-office":
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=180&h=180&fit=crop",
  "pasta-lab-downtown":
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=180&h=180&fit=crop",
  "green-bowl-kitchen":
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=180&h=180&fit=crop",
};

const DISH_IMAGES = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=260&h=220&fit=crop",
  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=260&h=220&fit=crop",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=260&h=220&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=260&h=220&fit=crop",
];

function getRating(seed: string) {
  const total = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return (4 + (total % 9) / 10).toFixed(1);
}

export default function SearchScreen() {
  const router = useRouter();
  const { itemCount } = useOrder();
  const [query, setQuery] = useState("");
  const restaurants = restaurantsData.restaurants;

  const suggestedRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return restaurants;
    }

    return restaurants.filter((restaurant) =>
      [restaurant.name, restaurant.category, restaurant.description].some(
        (value) => value.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [query, restaurants]);

  const popularDishes = useMemo(
    () =>
      dishesData.restaurants
        .flatMap((restaurant) =>
          restaurant.dishes.flatMap((category) =>
            category.items.slice(0, 1).map((item) => ({
              ...item,
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
            }))
          )
        )
        .slice(0, 4),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.headerIconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.headerIconButton}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={21} color="#111" />
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <SearchBar
        autoFocus
        value={query}
        onChangeText={setQuery}
        placeholder="Pizza"
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Keywords</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.keywordList}
          >
            {RECENT_KEYWORDS.map((keyword) => (
              <TouchableOpacity
                key={keyword}
                activeOpacity={0.75}
                style={styles.keywordChip}
                onPress={() => setQuery(keyword)}
              >
                <Text style={styles.keywordText}>{keyword}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Restaurants</Text>
          {suggestedRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              activeOpacity={0.75}
              style={styles.restaurantResult}
              onPress={() =>
                router.push({
                  pathname: "/restaurant/[id]",
                  params: { id: restaurant.id },
                })
              }
            >
              <Image
                source={{ uri: RESTAURANT_IMAGES[restaurant.id] }}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantResultText}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#ef6c22" />
                  <Text style={styles.ratingText}>{getRating(restaurant.id)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Fast Food</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularList}
          >
            {popularDishes.map((dish, index) => (
              <TouchableOpacity
                key={dish.id}
                activeOpacity={0.75}
                style={styles.popularCard}
                onPress={() =>
                  router.push({
                    pathname: "/restaurant/[id]",
                    params: { id: dish.restaurantId },
                  })
                }
              >
                <Image
                  source={{ uri: DISH_IMAGES[index % DISH_IMAGES.length] }}
                  style={styles.dishImage}
                />
                <Text style={styles.dishName} numberOfLines={1}>
                  {dish.name}
                </Text>
                <Text style={styles.dishRestaurant} numberOfLines={1}>
                  {dish.restaurantName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f5f7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: "#ef6c22",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  content: {
    paddingBottom: 28,
  },
  section: {
    marginTop: 6,
    marginBottom: 22,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },
  keywordList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  keywordChip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  keywordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  restaurantResult: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  restaurantResultText: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  popularList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  popularCard: {
    width: 128,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dishImage: {
    width: 108,
    height: 82,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  dishName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
  },
  dishRestaurant: {
    marginTop: 3,
    fontSize: 12,
    color: "#888",
  },
});
