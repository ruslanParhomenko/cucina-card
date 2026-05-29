"use server";

import { CalculationCardType } from "@/features/card-create/schema";
import { dbCard } from "@/lib/firebase-admin";

import { unstable_cache, updateTag } from "next/cache";

const db = dbCard;

export async function createCard(data: CalculationCardType) {
  if (!data.id) throw new Error("KEY_REQUIRED");
  const docRef = db.collection("cards").doc(data.id);

  const snapshot = await docRef.get();
  if (snapshot.exists) throw new Error("KEY_EXISTS");
  await docRef.set({
    name: data.name,
    unit: data.unit,
    category: data.category,
    weight: data.weight,
    expirationPeriod: data.expirationPeriod,
    portion: data.portion,
    description: data.description || "",
    recipe:
      data.recipe.map((r) => ({
        coefficient: r.coefficient,
        name: r.name,
        nameId: r.nameId,
        quantity: r.quantity,
        unit: r.unit,
      })) || [],
  });

  updateTag("cards");

  return docRef.id;
}

export async function updateCard(
  id: string,
  data: Omit<CalculationCardType, "id">,
) {
  if (!id) throw new Error("KEY_REQUIRED");
  const docRef = db.collection("cards").doc(id);

  await docRef.update(data);

  updateTag("cards");

  return docRef.id;
}

// get all
export async function _getAllCards() {
  const snapshot = await db.collection("cards").get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as CalculationCardType,
  );
}

export const getAllCards = unstable_cache(_getAllCards, ["cards"], {
  revalidate: false,
  tags: ["cards"],
});

// get by id

export async function getCardById(id: string) {
  if (!id) throw new Error("KEY_REQUIRED");
  const snapshot = await db.collection("cards").doc(id).get();
  if (!snapshot.exists) return null;

  return { id: snapshot.id, ...snapshot.data() };
}

// get by category
export async function _getCardsByCategory(category: string) {
  const snapshot = await db
    .collection("cards")
    .where("category", "==", category)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
export const getCardsByCategory = unstable_cache(
  _getCardsByCategory,
  ["cards"],
  {
    revalidate: false,
    tags: ["cards"],
  },
);

// delete

export async function deleteCard(id: string) {
  if (!id) throw new Error("KEY_REQUIRED");
  await db.collection("cards").doc(id).delete();
  updateTag("cards");
  return id;
}
