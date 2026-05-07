import { View, Text, StyleSheet } from "react-native";

export default function Cart() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    color: "#888",
  },
});
