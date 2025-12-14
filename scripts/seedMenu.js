const admin = require("firebase-admin");
const path = require("path");
const { menuCategories, menuItems } = require("../data/menuData");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const CAT_COL = "menu_categories";
const ITEM_COL = "menu_items";

async function seedMenu() {
  console.log("🔥 Uploading menu...");

  // ---------- Categories ----------
  const catBatch = db.batch();
  menuCategories.forEach((cat, index) => {
    const ref = db.collection(CAT_COL).doc(cat.id);
    catBatch.set(ref, {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      sortOrder: index,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await catBatch.commit();
  console.log("✅ Categories uploaded");

  // ---------- Items ----------
  const chunkSize = 400; // Firestore limit safety
  for (let i = 0; i < menuItems.length; i += chunkSize) {
    const batch = db.batch();
    const chunk = menuItems.slice(i, i + chunkSize);

    chunk.forEach((item) => {
      const ref = db.collection(ITEM_COL).doc(item.id);

      batch.set(ref, {
        name: item.name,
        description: item.description || "",
        categoryId: item.category,
        popular: !!item.popular,
        image: item.image || null,

        basePrice: item.sizes?.length ? 0 : item.price,
        sizes: item.sizes || [],

        isActive: true,

        // 🔥 platform toggles
        channels: {
          inStore: true,
          skip: true,
          doordash: true,
          uber: true,
        },

        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  }

  console.log("🎉 MENU UPLOAD COMPLETE");
}

seedMenu().catch(console.error);
