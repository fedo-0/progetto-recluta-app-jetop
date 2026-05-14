import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
  editable?: boolean;
  onPress?: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  autoFocus = false,
  editable = true,
  onPress,
  placeholder = "Search dishes, restaurants",
}: SearchBarProps) {
  const content = (
    <>
      <Ionicons name="search-outline" size={18} color="#9a9a9a" />
      <TextInput
        autoFocus={autoFocus}
        editable={editable && !onPress}
        onPressIn={onPress}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9a9a9a"
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 && editable && !onPress && (
        <TouchableOpacity
          accessibilityLabel="Clear search"
          hitSlop={8}
          onPress={() => onChangeText("")}
        >
          <Ionicons name="close-circle" size={18} color="#9a9a9a" />
        </TouchableOpacity>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 18,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
});
