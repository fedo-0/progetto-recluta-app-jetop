import { Paths, File } from "expo-file-system";

export type OrderItem = {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
};

export type RunningOrder = {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: "open" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

type OrderData = {
  orders: RunningOrder[];
};

const EMPTY_ORDER_DATA: OrderData = { orders: [] };

function getOrderFile(): File {
  return new File(Paths.document, "runningOrder.json");
}

async function ensureFile(): Promise<File> {
  const file = getOrderFile();
  if (!file.exists) {
    file.create({ overwrite: true });
    file.write(JSON.stringify(EMPTY_ORDER_DATA));
  }
  return file;
}

async function readOrders(): Promise<OrderData> {
  try {
    const file = await ensureFile();
    const content = await file.text();
    return JSON.parse(content);
  } catch {
    return EMPTY_ORDER_DATA;
  }
}

async function writeOrders(data: OrderData): Promise<void> {
  const file = await ensureFile();
  file.write(JSON.stringify(data, null, 2));
}

export async function getRunningOrder(
  userId: string
): Promise<RunningOrder | null> {
  const data = await readOrders();
  return data.orders.find((o) => o.userId === userId && o.status === "open") ?? null;
}

export async function addItemToOrder(
  userId: string,
  restaurantId: string,
  restaurantName: string,
  item: { dishId: string; name: string; price: number }
): Promise<{ order: RunningOrder }> {
  const data = await readOrders();
  let order = data.orders.find(
    (o) => o.userId === userId && o.status === "open"
  );

  if (order) {
    if (order.restaurantId !== restaurantId) {
      throw new ConflictError(order.restaurantName);
    }

    const existingItem = order.items.find((i) => i.dishId === item.dishId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      order.items.push({ ...item, quantity: 1 });
    }
    order.total = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    order.updatedAt = new Date().toISOString();
  } else {
    order = {
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId,
      restaurantId,
      restaurantName,
      items: [{ ...item, quantity: 1 }],
      total: item.price,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.orders.push(order);
  }

  await writeOrders(data);
  return { order };
}

export async function replaceOrder(
  userId: string,
  restaurantId: string,
  restaurantName: string,
  item: { dishId: string; name: string; price: number }
): Promise<{ order: RunningOrder }> {
  const data = await readOrders();
  const oldOrder = data.orders.find(
    (o) => o.userId === userId && o.status === "open"
  );

  if (oldOrder) {
    oldOrder.status = "cancelled";
    oldOrder.updatedAt = new Date().toISOString();
  }

  const order: RunningOrder = {
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId,
    restaurantId,
    restaurantName,
    items: [{ ...item, quantity: 1 }],
    total: item.price,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.orders.push(order);

  await writeOrders(data);
  return { order };
}

export async function updateItemQuantity(
  userId: string,
  dishId: string,
  quantity: number
): Promise<RunningOrder | null> {
  const data = await readOrders();
  const order = data.orders.find(
    (o) => o.userId === userId && o.status === "open"
  );
  if (!order) return null;

  if (quantity <= 0) {
    order.items = order.items.filter((i) => i.dishId !== dishId);
  } else {
    const item = order.items.find((i) => i.dishId === dishId);
    if (item) {
      item.quantity = quantity;
    }
  }

  if (order.items.length === 0) {
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    await writeOrders(data);
    return null;
  }

  order.total = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  order.updatedAt = new Date().toISOString();
  await writeOrders(data);
  return order;
}

export async function clearOrder(userId: string): Promise<void> {
  const data = await readOrders();
  const order = data.orders.find(
    (o) => o.userId === userId && o.status === "open"
  );
  if (order) {
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    await writeOrders(data);
  }
}

export class ConflictError extends Error {
  constructor(public currentRestaurant: string) {
    super(`You already have an order from ${currentRestaurant}`);
    this.name = "ConflictError";
  }
}
