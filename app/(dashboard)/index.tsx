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
  delivery?: {
    defaultAddressId: string;
    addresses: DeliveryAddress[];
  };
};

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const restaurants = restaurantsData.restaurants;
  const users = usersData as AppUser[];
  const currentUser = users.find((user) => user.id === CURRENT_USER_ID);
  const deliveryAddresses = currentUser?.delivery?.addresses ?? [];
  const [selectedAddressId, setSelectedAddressId] = useState(
    currentUser?.delivery?.defaultAddressId ?? deliveryAddresses[0]?.id ?? ""
  );
  const selectedDeliveryAddress = deliveryAddresses.find(
    (address) => address.id === selectedAddressId
  );
  const deliveryLocationLabel =
    selectedDeliveryAddress?.label ?? "Select location";
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
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Restaurants</Text>
        <Text style={styles.subtitle}>Browse available restaurants</Text>
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
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
