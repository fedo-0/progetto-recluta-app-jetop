import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type MenuItemCardProps = {
  dishId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
};

export default function MenuItemCard({
  name,
  description,
  price,
  quantity,
  onAdd,
  onRemove,
}: MenuItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.body}>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        </View>
        <View style={styles.controls}>
          {quantity > 0 ? (
            <>
              <TouchableOpacity style={styles.qtyButton} onPress={onRemove}>
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyBadge}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={onAdd}>
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  description: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    fontWeight: "700",
    color: "#fff",
  },
  qtyBadge: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    minWidth: 24,
    textAlign: "center",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
});
