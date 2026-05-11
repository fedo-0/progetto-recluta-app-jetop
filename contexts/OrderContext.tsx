import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Alert } from "react-native";
import {
  getRunningOrder,
  addItemToOrder,
  replaceOrder,
  updateItemQuantity,
  clearOrder,
  ConflictError,
  type RunningOrder,
  type OrderItem,
} from "../services/orderService";

const CURRENT_USER = "client-maria-rossi";

type OrderContextType = {
  order: RunningOrder | null;
  loading: boolean;
  itemCount: number;
  addItem: (
    restaurantId: string,
    restaurantName: string,
    item: Omit<OrderItem, "quantity">
  ) => Promise<void>;
  updateQuantity: (dishId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<RunningOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const o = await getRunningOrder(CURRENT_USER);
      setOrder(o);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (
      restaurantId: string,
      restaurantName: string,
      item: Omit<OrderItem, "quantity">
    ) => {
      try {
        const { order: updated } = await addItemToOrder(
          CURRENT_USER,
          restaurantId,
          restaurantName,
          item
        );
        setOrder(updated);
      } catch (err) {
        if (err instanceof ConflictError) {
          Alert.alert(
            "Change Restaurant?",
            `You already have an order from ${err.currentRestaurant}. Do you want to replace it with items from ${restaurantName}?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Replace",
                style: "destructive",
                onPress: async () => {
                  const { order: updated } = await replaceOrder(
                    CURRENT_USER,
                    restaurantId,
                    restaurantName,
                    item
                  );
                  setOrder(updated);
                },
              },
            ]
          );
        }
      }
    },
    []
  );

  const updateQuantity = useCallback(
    async (dishId: string, quantity: number) => {
      const updated = await updateItemQuantity(CURRENT_USER, dishId, quantity);
      setOrder(updated);
    },
    []
  );

  const clear = useCallback(async () => {
    await clearOrder(CURRENT_USER);
    setOrder(null);
  }, []);

  const itemCount = order
    ? order.items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  return (
    <OrderContext.Provider
      value={{
        order,
        loading,
        itemCount,
        addItem,
        updateQuantity,
        clear,
        refresh,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
