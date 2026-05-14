import SearchBar from "@/components/SearchBar";
import RestaurantCard from "@/components/RestaurantCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import restaurantsData from "../../data/restaurants.json" with { type: "json" };
import usersData from "../../data/users.json" with { type: "json" };
import { useOrder } from "../../contexts/OrderContext";

const CURRENT_USER_ID = "client-maria-rossi";

type DeliveryAddress = {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  instructions: string;
};

type AppUser = {
  id: string;
  name: string;
  delivery?: {
    defaultAddressId: string;
    addresses: DeliveryAddress[];
  };
};

function getDayGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function Dashboard() {
  const router = useRouter();
  const { itemCount } = useOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const restaurants = restaurantsData.restaurants;
  const users = usersData as AppUser[];
  const currentUser = users.find((user) => user.id === CURRENT_USER_ID);
  const firstName = currentUser?.name.split(" ")[0] ?? "there";
  const deliveryAddresses = currentUser?.delivery?.addresses ?? [];
  const [selectedAddressId, setSelectedAddressId] = useState(
    currentUser?.delivery?.defaultAddressId ?? deliveryAddresses[0]?.id ?? ""
  );
  const selectedDeliveryAddress = deliveryAddresses.find(
    (address) => address.id === selectedAddressId
  );
  const deliveryLocationLabel =
    selectedDeliveryAddress?.label ?? "Select location";
  const restaurantCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(restaurants.map((restaurant) => restaurant.category))
      ),
    ],
    [restaurants]
  );
  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return restaurants.filter((restaurant) => {
      const matchesCategory =
        selectedCategory === "All" || restaurant.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        [restaurant.name, restaurant.category, restaurant.description].some(
          (value) => value.toLowerCase().includes(normalizedQuery)
        );

      return matchesCategory && matchesSearch;
    });
  }, [restaurants, searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.deliveryInfo}
          onPress={() => setAddressModalVisible(true)}
        >
          <View style={styles.locationIcon}>
            <Ionicons name="location-outline" size={18} color="#ef6c22" />
          </View>
          <View>
            <Text style={styles.deliveryLabel}>DELIVER TO</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>{deliveryLocationLabel}</Text>
              <Ionicons name="chevron-down" size={14} color="#555" />
            </View>
          </View>
        </TouchableOpacity>
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

      {/* Greeting + Search */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>
          Hey {firstName}, {getDayGreeting()}!
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={() => router.push("/search")}
        />
      </View>

      {/* Categories */}
      <View style={styles.categorySection}>
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>All Categories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {restaurantCategories.map((category) => {
            const selected = category === selectedCategory;

            return (
              <TouchableOpacity
                key={category}
                activeOpacity={0.75}
                style={[
                  styles.categoryPill,
                  selected && styles.selectedCategoryPill,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Restaurants Display */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Restaurants</Text>
        <Text style={styles.subtitle}>Browse available restaurants</Text>
      </View>
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
      <Modal
        animationType="slide"
        transparent
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setAddressModalVisible(false)}
          />
          <View style={styles.addressSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Delivery Address</Text>
            {deliveryAddresses.map((address) => {
              const selected = address.id === selectedAddressId;

              return (
                <TouchableOpacity
                  key={address.id}
                  activeOpacity={0.75}
                  style={[
                    styles.addressOption,
                    selected && styles.selectedAddressOption,
                  ]}
                  onPress={() => {
                    setSelectedAddressId(address.id);
                    setAddressModalVisible(false);
                  }}
                >
                  <View style={styles.addressOptionIcon}>
                    <Ionicons
                      name={selected ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={selected ? "#ef6c22" : "#aaa"}
                    />
                  </View>
                  <View style={styles.addressOptionText}>
                    <Text style={styles.addressLabel}>{address.label}</Text>
                    <Text style={styles.addressLine}>
                      {address.street}, {address.city} {address.postalCode}
                    </Text>
                    <Text style={styles.addressInstructions}>
                      {address.instructions}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
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
  deliveryInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  deliveryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ef6c22",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginRight: 4,
  },
  greetingSection: {
    paddingTop: 4,
  },
  greetingText: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  categorySection: {
    paddingBottom: 18,
  },
  sectionHeadingRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    minWidth: 76,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCategoryPill: {
    backgroundColor: "#ffd66b",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  selectedCategoryText: {
    color: "#111",
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 14,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  addressSheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#fff",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: "#ddd",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 14,
  },
  addressOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  selectedAddressOption: {
    borderColor: "#ef6c22",
    backgroundColor: "#fff7f2",
  },
  addressOptionIcon: {
    paddingTop: 2,
    marginRight: 10,
  },
  addressOptionText: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  addressLine: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  addressInstructions: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
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
});
