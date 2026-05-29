"use server";
import { ProductType } from "@/features/product-create/schema";
import { dbCard } from "@/lib/firebase-admin";
import { unstable_cache, updateTag } from "next/cache";

const db = dbCard;
// create
export async function createProduct(data: ProductType) {
  if (!data.id) throw new Error("KEY_REQUIRED");

  const docRef = db.collection("products").doc(data.id);

  const snapshot = await docRef.get();
  if (snapshot.exists) throw new Error("KEY_EXISTS");

  await docRef.set({
    name: data.name,
    coefficient: data.coefficient,
    unit: data.unit,
    category: data.category,
  });

  updateTag("products");
  return docRef.id;
}

// update

export async function updateProduct(id: string, data: Omit<ProductType, "id">) {
  if (!id) throw new Error("KEY_REQUIRED");

  const docRef = db.collection("products").doc(id);

  await docRef.update(data);
  updateTag("products");
  return id;
}

// get all
export async function _getAllProducts() {
  const snapshot = await db.collection("products").get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as ProductType,
  );
}

export const getAllProducts = unstable_cache(_getAllProducts, ["products"], {
  revalidate: false,
  tags: ["products"],
});

// get by id
export async function getProductById(key: string) {
  if (!key) throw new Error("KEY_REQUIRED");

  const snapshot = await db.collection("products").doc(key).get();
  if (!snapshot.exists) return null;

  return { id: snapshot.id, ...snapshot.data() };
}

// get by category
export async function _getProductsByCategory(category: string) {
  const snapshot = await db
    .collection("products")
    .where("category", "==", category)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export const getProductByCategory = unstable_cache(
  _getProductsByCategory,
  ["products"],
  {
    revalidate: false,
    tags: ["products"],
  },
);

// delete
export async function deleteProduct(id: string) {
  if (!id) throw new Error("KEY_REQUIRED");

  await db.collection("products").doc(id).delete();
  updateTag("products");
  return id;
}
