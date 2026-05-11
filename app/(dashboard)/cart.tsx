import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrder } from "../../contexts/OrderContext";

export default function Cart() {
  const router = useRouter();
  const { order, loading, updateQuantity, clear } = useOrder();

  const handleRemoveItem = (dishId: string) => {
    Alert.alert("Remove Item", "Remove this item from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => updateQuantity(dishId, 0),
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!order || order.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.browseButtonText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>{"←"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
      </View>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{order.restaurantName}</Text>
      </View>
      <FlatList
        data={order.items}
        keyExtractor={(item) => item.dishId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => {
                  if (item.quantity <= 1) {
                    handleRemoveItem(item.dishId);
                  } else {
                    updateQuantity(item.dishId, item.quantity - 1);
                  }
                }}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => updateQuantity(item.dishId, item.quantity + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Total: ${order.total.toFixed(2)}
        </Text>
        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Alert.alert("Clear Cart", "Remove all items from your cart?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  style: "destructive",
                  onPress: () => clear(),
                },
              ]);
            }}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  backText: {
    fontSize: 24,
    color: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  restaurantInfo: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    color: "#666",
  },
  list: {
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  itemPrice: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    minWidth: 24,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  footerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
  },
  orderButton: {
    flex: 2,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 40,
  },
  browseButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
