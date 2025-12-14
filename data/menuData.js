// data/menuData.js
// Complete Lava Pizza YYC Menu - Comprehensive Version
// All items extracted from restaurant menu

// (TypeScript interfaces removed for JS)

export const menuCategories = [
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'gourmet-pizza', name: 'Gourmet Pizza', icon: '🍕' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'appetizers', name: 'Appetizers', icon: '🥟' },
  { id: 'chicken-wings', name: 'Chicken Wings', icon: '🍗' },
  { id: 'poutines', name: 'Poutines', icon: '🍟' },
  { id: 'shawarma', name: 'Shawarma & Donair', icon: '🌯' },
  { id: 'subs', name: 'Subs & Sandwiches', icon: '🥪' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'salads', name: 'Salads', icon: '🥗' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'drinks', name: 'Drinks & Dips', icon: '🥤' },
  { id: 'deals', name: 'Special Deals', icon: '⭐' },
];

export const menuItems = [
  // ========== CLASSIC PIZZAS ==========
  {
    id: 'cheese-pizza',
    name: 'Cheese Pizza',
    description: 'Classic mozzarella cheese pizza',
    sizes: [
      { size: 'Small 10"', price: 9.99 },
      { size: 'Medium 12"', price: 13.99 },
      { size: 'Large 14"', price: 17.99 },
      { size: 'X-Large 16"', price: 21.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella cheese',
    sizes: [
      { size: 'Small 10"', price: 11.99 },
      { size: 'Medium 12"', price: 15.99 },
      { size: 'Large 14"', price: 19.99 },
      { size: 'X-Large 16"', price: 23.99 },
    ],
    category: 'pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'hawaiian-pizza',
    name: 'Hawaiian Pizza',
    description: 'Ham, pineapple, and mozzarella cheese',
    sizes: [
      { size: 'Small 10"', price: 12.99 },
      { size: 'Medium 12"', price: 16.99 },
      { size: 'Large 14"', price: 20.99 },
      { size: 'X-Large 16"', price: 24.99 },
    ],
    category: 'pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'veggie-pizza',
    name: 'Vegetarian Pizza',
    description: 'Mushrooms, green peppers, onions, tomatoes, black olives',
    sizes: [
      { size: 'Small 10"', price: 12.99 },
      { size: 'Medium 12"', price: 16.99 },
      { size: 'Large 14"', price: 20.99 },
      { size: 'X-Large 16"', price: 24.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'meat-lovers-pizza',
    name: 'Meat Lovers Pizza',
    description: 'Pepperoni, ham, bacon, Italian sausage, ground beef',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'deluxe-pizza',
    name: 'Deluxe Pizza',
    description: 'Pepperoni, mushrooms, green peppers, onions, Italian sausage',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'canadian-pizza',
    name: 'Canadian Pizza',
    description: 'Pepperoni, mushrooms, bacon',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'greek-pizza',
    name: 'Greek Pizza',
    description: 'Feta cheese, black olives, tomatoes, onions, green peppers',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'chicken-pizza',
    name: 'Chicken Pizza',
    description: 'Grilled chicken, mushrooms, green peppers, onions',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'mexicana-pizza',
    name: 'Mexicana Pizza',
    description: 'Ground beef, onions, green peppers, jalapeños, tomatoes',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'bacon-cheeseburger-pizza',
    name: 'Bacon Cheeseburger Pizza',
    description: 'Ground beef, bacon, onions, pickles, cheddar cheese',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'supreme-pizza',
    name: 'Supreme Pizza',
    description:
      'Pepperoni, ham, mushrooms, green peppers, onions, Italian sausage',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'pizza',
    price: 0,
  },
  {
    id: 'tropical-hawaiian-pizza',
    name: 'Tropical Hawaiian Pizza',
    description: 'Ham, pineapple, bacon, green peppers',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'pizza',
    price: 0,
  },

  // ========== GOURMET SPECIALTY PIZZAS ==========
  {
    id: 'bbq-chicken-pizza',
    name: 'BBQ Chicken Pizza',
    description: 'BBQ sauce, grilled chicken, red onions, bacon, cilantro',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'chicken-ranch-pizza',
    name: 'Chicken Ranch Pizza',
    description: 'Ranch sauce, grilled chicken, bacon, tomatoes, red onions',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'butter-chicken-pizza',
    name: 'Butter Chicken Pizza',
    description:
      'Butter chicken sauce, marinated chicken, onions, green peppers, cilantro',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'tandoori-chicken-pizza',
    name: 'Tandoori Chicken Pizza',
    description:
      'Tandoori sauce, marinated chicken, onions, green peppers, cilantro',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    popular: true,
    price: 0,
  },
  {
    id: 'achari-chicken-pizza',
    name: 'Achari Chicken Pizza',
    description:
      'Achari sauce, marinated chicken, onions, green peppers, mixed pickles',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    price: 0,
  },
  {
    id: 'buffalo-chicken-pizza',
    name: 'Buffalo Chicken Pizza',
    description: 'Buffalo sauce, grilled chicken, red onions, blue cheese crumbles',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    price: 0,
  },
  {
    id: 'pesto-chicken-pizza',
    name: 'Pesto Chicken Pizza',
    description:
      'Pesto sauce, grilled chicken, sun-dried tomatoes, artichokes, feta',
    sizes: [
      { size: 'Small 10"', price: 14.99 },
      { size: 'Medium 12"', price: 18.99 },
      { size: 'Large 14"', price: 22.99 },
      { size: 'X-Large 16"', price: 26.99 },
    ],
    category: 'gourmet-pizza',
    price: 0,
  },
  {
    id: 'veggie-supreme-pizza',
    name: 'Veggie Supreme Pizza',
    description:
      'Mushrooms, green peppers, onions, tomatoes, black olives, artichokes, spinach',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'gourmet-pizza',
    price: 0,
  },
  {
    id: 'mediterranean-pizza',
    name: 'Mediterranean Pizza',
    description: 'Spinach, feta cheese, sun-dried tomatoes, olives, red onions',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'gourmet-pizza',
    price: 0,
  },
  {
    id: 'white-pizza',
    name: 'White Pizza',
    description: 'Garlic sauce, ricotta, mozzarella, parmesan, fresh basil',
    sizes: [
      { size: 'Small 10"', price: 13.99 },
      { size: 'Medium 12"', price: 17.99 },
      { size: 'Large 14"', price: 21.99 },
      { size: 'X-Large 16"', price: 25.99 },
    ],
    category: 'gourmet-pizza',
    price: 0,
  },

  // ========== PASTA ==========
  {
    id: 'spaghetti-marinara',
    name: 'Spaghetti Marinara',
    description: 'Classic spaghetti with marinara sauce',
    price: 12.99,
    category: 'pasta',
  },
  {
    id: 'spaghetti-meatballs',
    name: 'Spaghetti & Meatballs',
    description: 'Spaghetti with meatballs in marinara sauce',
    price: 14.99,
    category: 'pasta',
    popular: true,
  },
  {
    id: 'spaghetti-meat-sauce',
    name: 'Spaghetti with Meat Sauce',
    description: 'Spaghetti with savory meat sauce',
    price: 13.99,
    category: 'pasta',
  },
  {
    id: 'penne-alfredo',
    name: 'Penne Alfredo',
    description: 'Penne pasta in creamy alfredo sauce',
    price: 12.99,
    category: 'pasta',
    popular: true,
  },
  {
    id: 'penne-marinara',
    name: 'Penne Marinara',
    description: 'Penne pasta with marinara sauce',
    price: 12.99,
    category: 'pasta',
  },
  {
    id: 'penne-meat-sauce',
    name: 'Penne with Meat Sauce',
    description: 'Penne pasta with savory meat sauce',
    price: 13.99,
    category: 'pasta',
  },
  {
    id: 'penne-arrabbiata',
    name: 'Penne Arrabbiata',
    description: 'Penne in spicy tomato sauce with garlic and red peppers',
    price: 13.99,
    category: 'pasta',
  },
  {
    id: 'fettuccine-alfredo',
    name: 'Fettuccine Alfredo',
    description: 'Fettuccine in creamy alfredo sauce',
    price: 12.99,
    category: 'pasta',
  },
  {
    id: 'fettuccine-carbonara',
    name: 'Fettuccine Carbonara',
    description: 'Fettuccine with bacon, eggs, parmesan in cream sauce',
    price: 14.99,
    category: 'pasta',
  },
  {
    id: 'chicken-alfredo',
    name: 'Chicken Alfredo',
    description: 'Fettuccine alfredo with grilled chicken',
    price: 15.99,
    category: 'pasta',
    popular: true,
  },
  {
    id: 'chicken-penne',
    name: 'Chicken Penne',
    description: 'Penne with grilled chicken in marinara or alfredo sauce',
    price: 15.99,
    category: 'pasta',
  },
  {
    id: 'baked-lasagna',
    name: 'Baked Lasagna',
    description:
      'Layers of pasta with meat sauce, ricotta, and mozzarella cheese',
    price: 14.99,
    category: 'pasta',
    popular: true,
  },
  {
    id: 'vegetarian-lasagna',
    name: 'Vegetarian Lasagna',
    description:
      'Layers of pasta with vegetables, marinara, ricotta, and mozzarella',
    price: 14.99,
    category: 'pasta',
  },
  {
    id: 'baked-ziti',
    name: 'Baked Ziti',
    description: 'Ziti pasta baked with marinara sauce and mozzarella cheese',
    price: 13.99,
    category: 'pasta',
  },
  {
    id: 'ravioli',
    name: 'Cheese Ravioli',
    description: 'Cheese-filled ravioli in marinara or alfredo sauce',
    price: 14.99,
    category: 'pasta',
  },

  // ========== APPETIZERS ==========
  {
    id: 'garlic-bread',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 5.99,
    category: 'appetizers',
  },
  {
    id: 'garlic-bread-cheese',
    name: 'Garlic Bread with Cheese',
    description: 'Toasted bread with garlic butter and melted mozzarella',
    price: 7.99,
    category: 'appetizers',
    popular: true,
  },
  {
    id: 'breadsticks',
    name: 'Breadsticks',
    description: 'Soft breadsticks served with marinara sauce',
    price: 6.99,
    category: 'appetizers',
  },
  {
    id: 'cheese-breadsticks',
    name: 'Cheese Breadsticks',
    description: 'Breadsticks topped with mozzarella cheese',
    price: 8.99,
    category: 'appetizers',
  },
  {
    id: 'mozzarella-sticks',
    name: 'Mozzarella Sticks (8 pcs)',
    description: 'Breaded mozzarella sticks served with marinara sauce',
    price: 8.99,
    category: 'appetizers',
    popular: true,
  },
  {
    id: 'jalapeno-poppers',
    name: 'Jalapeño Poppers (8 pcs)',
    description: 'Cream cheese filled jalapeños, breaded and fried',
    price: 8.99,
    category: 'appetizers',
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Crispy golden onion rings',
    price: 7.99,
    category: 'appetizers',
  },
  {
    id: 'chicken-tenders',
    name: 'Chicken Tenders (5 pcs)',
    description: 'Breaded chicken tenders with choice of dipping sauce',
    price: 10.99,
    category: 'appetizers',
  },
  {
    id: 'chicken-nuggets',
    name: 'Chicken Nuggets (10 pcs)',
    description: 'Golden fried chicken nuggets',
    price: 8.99,
    category: 'appetizers',
  },
  {
    id: 'potato-skins',
    name: 'Potato Skins',
    description: 'Potato skins loaded with cheese, bacon, and sour cream',
    price: 9.99,
    category: 'appetizers',
  },
  {
    id: 'nachos',
    name: 'Nachos',
    description: 'Tortilla chips with cheese, jalapeños, sour cream, and salsa',
    price: 9.99,
    category: 'appetizers',
  },
  {
    id: 'loaded-nachos',
    name: 'Loaded Nachos',
    description:
      'Nachos with cheese, ground beef, jalapeños, sour cream, guacamole',
    price: 12.99,
    category: 'appetizers',
  },
  {
    id: 'samosas',
    name: 'Samosas (4 pcs)',
    description: 'Vegetable or beef samosas',
    price: 6.99,
    category: 'appetizers',
  },
  {
    id: 'spring-rolls',
    name: 'Spring Rolls (6 pcs)',
    description: 'Vegetable spring rolls served with sweet chili sauce',
    price: 7.99,
    category: 'appetizers',
  },

  // ========== CHICKEN WINGS ==========
  {
    id: 'wings-1lb',
    name: 'Chicken Wings (1 lb)',
    description:
      'Choice of: Hot, Medium, Mild, Honey Garlic, BBQ, Teriyaki, Salt & Pepper, Lemon Pepper, Cajun, Sweet Chili',
    price: 12.99,
    category: 'chicken-wings',
    popular: true,
  },
  {
    id: 'wings-2lb',
    name: 'Chicken Wings (2 lbs)',
    description:
      'Choice of: Hot, Medium, Mild, Honey Garlic, BBQ, Teriyaki, Salt & Pepper, Lemon Pepper, Cajun, Sweet Chili',
    price: 22.99,
    category: 'chicken-wings',
    popular: true,
  },
  {
    id: 'wings-3lb',
    name: 'Chicken Wings (3 lbs)',
    description:
      'Choice of: Hot, Medium, Mild, Honey Garlic, BBQ, Teriyaki, Salt & Pepper, Lemon Pepper, Cajun, Sweet Chili',
    price: 32.99,
    category: 'chicken-wings',
  },
  {
    id: 'wings-4lb',
    name: 'Chicken Wings (4 lbs)',
    description:
      'Choice of: Hot, Medium, Mild, Honey Garlic, BBQ, Teriyaki, Salt & Pepper, Lemon Pepper, Cajun, Sweet Chili',
    price: 42.99,
    category: 'chicken-wings',
  },
  {
    id: 'boneless-wings-1lb',
    name: 'Boneless Wings (1 lb)',
    description: 'Boneless chicken bites with your choice of sauce',
    price: 11.99,
    category: 'chicken-wings',
  },
  {
    id: 'boneless-wings-2lb',
    name: 'Boneless Wings (2 lbs)',
    description: 'Boneless chicken bites with your choice of sauce',
    price: 20.99,
    category: 'chicken-wings',
  },

  // ========== POUTINES ==========
  {
    id: 'classic-poutine',
    name: 'Classic Poutine',
    description: 'French fries, gravy, and cheese curds',
    price: 9.99,
    category: 'poutines',
    popular: true,
  },
  {
    id: 'chicken-poutine',
    name: 'Chicken Poutine',
    description: 'Fries, gravy, cheese curds, topped with grilled chicken',
    price: 12.99,
    category: 'poutines',
    popular: true,
  },
  {
    id: 'donair-poutine',
    name: 'Donair Poutine',
    description: 'Fries, gravy, cheese curds, topped with donair meat',
    price: 13.99,
    category: 'poutines',
  },
  {
    id: 'beef-poutine',
    name: 'Beef Poutine',
    description: 'Fries, gravy, cheese curds, topped with seasoned ground beef',
    price: 13.99,
    category: 'poutines',
  },
  {
    id: 'pulled-pork-poutine',
    name: 'Pulled Pork Poutine',
    description: 'Fries, gravy, cheese curds, topped with pulled pork',
    price: 13.99,
    category: 'poutines',
  },
  {
    id: 'bacon-poutine',
    name: 'Bacon Poutine',
    description: 'Fries, gravy, cheese curds, topped with crispy bacon',
    price: 11.99,
    category: 'poutines',
  },
  {
    id: 'veggie-poutine',
    name: 'Veggie Poutine',
    description: 'Fries, gravy, cheese curds, topped with sautéed vegetables',
    price: 11.99,
    category: 'poutines',
  },

  // ========== SHAWARMA & DONAIR ==========
  {
    id: 'chicken-shawarma-wrap',
    name: 'Chicken Shawarma Wrap',
    description:
      'Marinated chicken with garlic sauce, lettuce, tomatoes, pickles, turnips',
    price: 10.99,
    category: 'shawarma',
    popular: true,
  },
  {
    id: 'beef-shawarma-wrap',
    name: 'Beef Shawarma Wrap',
    description:
      'Marinated beef with tahini sauce, lettuce, tomatoes, onions, parsley',
    price: 11.99,
    category: 'shawarma',
  },
  {
    id: 'mixed-shawarma-wrap',
    name: 'Mixed Shawarma Wrap',
    description: 'Chicken and beef with sauces, lettuce, tomatoes, pickles',
    price: 12.99,
    category: 'shawarma',
  },
  {
    id: 'falafel-wrap',
    name: 'Falafel Wrap',
    description:
      'Crispy falafel with tahini sauce, lettuce, tomatoes, pickles, turnips',
    price: 9.99,
    category: 'shawarma',
  },
  {
    id: 'donair-wrap',
    name: 'Donair Wrap',
    description: 'Donair meat with sweet sauce, onions, tomatoes',
    price: 10.99,
    category: 'shawarma',
    popular: true,
  },
  {
    id: 'chicken-shawarma-plate',
    name: 'Chicken Shawarma Plate',
    description:
      'Chicken shawarma with rice, salad, hummus, garlic sauce, and pita',
    price: 15.99,
    category: 'shawarma',
  },
  {
    id: 'beef-shawarma-plate',
    name: 'Beef Shawarma Plate',
    description:
      'Beef shawarma with rice, salad, hummus, tahini sauce, and pita',
    price: 16.99,
    category: 'shawarma',
  },
  {
    id: 'mixed-shawarma-plate',
    name: 'Mixed Shawarma Plate',
    description:
      'Chicken and beef shawarma with rice, salad, hummus, sauces, and pita',
    price: 17.99,
    category: 'shawarma',
  },
  {
    id: 'falafel-plate',
    name: 'Falafel Plate',
    description: 'Falafel with rice, salad, hummus, tahini sauce, and pita',
    price: 14.99,
    category: 'shawarma',
  },
  {
    id: 'donair-plate',
    name: 'Donair Plate',
    description: 'Donair meat with rice, salad, sweet sauce, and pita',
    price: 15.99,
    category: 'shawarma',
  },

  // ========== SUBS & SANDWICHES ==========
  {
    id: 'meatball-sub',
    name: 'Meatball Sub',
    description: 'Meatballs, marinara sauce, and mozzarella cheese on sub bun',
    price: 10.99,
    category: 'subs',
  },
  {
    id: 'chicken-parmesan-sub',
    name: 'Chicken Parmesan Sub',
    description: 'Breaded chicken, marinara sauce, and mozzarella cheese',
    price: 11.99,
    category: 'subs',
    popular: true,
  },
  {
    id: 'steak-cheese-sub',
    name: 'Steak & Cheese Sub',
    description: 'Sliced steak, onions, peppers, and melted cheese',
    price: 12.99,
    category: 'subs',
  },
  {
    id: 'italian-sub',
    name: 'Italian Sub',
    description:
      'Ham, salami, pepperoni, cheese, lettuce, tomatoes, Italian dressing',
    price: 11.99,
    category: 'subs',
  },
  {
    id: 'ham-cheese-sub',
    name: 'Ham & Cheese Sub',
    description: 'Ham, cheese, lettuce, tomatoes, and mayo',
    price: 10.99,
    category: 'subs',
  },
  {
    id: 'turkey-sub',
    name: 'Turkey Sub',
    description: 'Turkey, cheese, lettuce, tomatoes, and mayo',
    price: 10.99,
    category: 'subs',
  },
  {
    id: 'veggie-sub',
    name: 'Veggie Sub',
    description: 'Lettuce, tomatoes, onions, peppers, olives, and cheese',
    price: 9.99,
    category: 'subs',
  },
  {
    id: 'blt-sub',
    name: 'BLT Sub',
    description: 'Bacon, lettuce, tomatoes, and mayo',
    price: 10.99,
    category: 'subs',
  },
  {
    id: 'club-sub',
    name: 'Club Sub',
    description: 'Turkey, ham, bacon, cheese, lettuce, tomatoes, and mayo',
    price: 12.99,
    category: 'subs',
  },

  // ========== BURGERS ==========
  {
    id: 'classic-burger',
    name: 'Classic Burger',
    description:
      'Beef patty, lettuce, tomatoes, onions, pickles, ketchup, mustard',
    price: 9.99,
    category: 'burgers',
  },
  {
    id: 'cheeseburger',
    name: 'Cheeseburger',
    description: 'Beef patty, cheese, lettuce, tomatoes, onions, pickles',
    price: 10.99,
    category: 'burgers',
    popular: true,
  },
  {
    id: 'bacon-cheeseburger',
    name: 'Bacon Cheeseburger',
    description: 'Beef patty, bacon, cheese, lettuce, tomatoes, onions',
    price: 12.99,
    category: 'burgers',
  },
  {
    id: 'mushroom-swiss-burger',
    name: 'Mushroom Swiss Burger',
    description: 'Beef patty, sautéed mushrooms, Swiss cheese, lettuce, tomatoes',
    price: 12.99,
    category: 'burgers',
  },
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    description: 'Grilled or crispy chicken, lettuce, tomatoes, mayo',
    price: 10.99,
    category: 'burgers',
  },
  {
    id: 'veggie-burger',
    name: 'Veggie Burger',
    description: 'Veggie patty, lettuce, tomatoes, onions, pickles',
    price: 9.99,
    category: 'burgers',
  },
  {
    id: 'double-burger',
    name: 'Double Burger',
    description: 'Two beef patties, cheese, lettuce, tomatoes, onions',
    price: 13.99,
    category: 'burgers',
  },

  // ========== SALADS ==========
  {
    id: 'garden-salad',
    name: 'Garden Salad',
    description:
      'Mixed greens, tomatoes, cucumbers, onions, carrots, choice of dressing',
    price: 9.99,
    category: 'salads',
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan cheese, croutons, caesar dressing',
    price: 9.99,
    category: 'salads',
  },
  {
    id: 'greek-salad',
    name: 'Greek Salad',
    description:
      'Lettuce, tomatoes, cucumbers, red onions, black olives, feta cheese, Greek dressing',
    price: 10.99,
    category: 'salads',
  },
  {
    id: 'chicken-caesar-salad',
    name: 'Chicken Caesar Salad',
    description: 'Caesar salad topped with grilled chicken',
    price: 12.99,
    category: 'salads',
    popular: true,
  },
  {
    id: 'chicken-garden-salad',
    name: 'Chicken Garden Salad',
    description: 'Garden salad topped with grilled chicken',
    price: 12.99,
    category: 'salads',
  },
  {
    id: 'chicken-greek-salad',
    name: 'Chicken Greek Salad',
    description: 'Greek salad topped with grilled chicken',
    price: 13.99,
    category: 'salads',
  },
  {
    id: 'taco-salad',
    name: 'Taco Salad',
    description:
      'Lettuce, ground beef, cheese, tomatoes, onions, tortilla chips, salsa, sour cream',
    price: 12.99,
    category: 'salads',
  },

  // ========== SIDES ==========
  {
    id: 'french-fries',
    name: 'French Fries',
    description: 'Crispy golden french fries',
    price: 5.99,
    category: 'sides',
  },
  {
    id: 'curly-fries',
    name: 'Curly Fries',
    description: 'Seasoned curly fries',
    price: 6.99,
    category: 'sides',
  },
  {
    id: 'sweet-potato-fries',
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries',
    price: 7.99,
    category: 'sides',
  },
  {
    id: 'potato-wedges',
    name: 'Potato Wedges',
    description: 'Seasoned potato wedges',
    price: 6.99,
    category: 'sides',
  },
  {
    id: 'coleslaw',
    name: 'Coleslaw',
    description: 'Creamy coleslaw',
    price: 4.99,
    category: 'sides',
  },
  {
    id: 'rice',
    name: 'Rice',
    description: 'Steamed basmati rice',
    price: 4.99,
    category: 'sides',
  },
  {
    id: 'hummus-pita',
    name: 'Hummus & Pita',
    description: 'Creamy hummus served with warm pita bread',
    price: 6.99,
    category: 'sides',
  },

  // ========== DESSERTS ==========
  {
    id: 'chocolate-cake',
    name: 'Chocolate Cake',
    description: 'Rich chocolate layer cake',
    price: 5.99,
    category: 'desserts',
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Classic New York style cheesecake',
    price: 5.99,
    category: 'desserts',
    popular: true,
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Italian coffee-flavored dessert',
    price: 6.99,
    category: 'desserts',
  },
  {
    id: 'brownie',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie',
    price: 5.99,
    category: 'desserts',
  },
  {
    id: 'brownie-ice-cream',
    name: 'Brownie with Ice Cream',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 7.99,
    category: 'desserts',
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream (3 scoops)',
    description: 'Choice of vanilla, chocolate, or strawberry',
    price: 5.99,
    category: 'desserts',
  },

  // ========== DRINKS & DIPS ==========
  {
    id: 'pop-can',
    name: 'Pop (Can)',
    description: 'Coke, Pepsi, Sprite, Ginger Ale, Root Beer, etc.',
    price: 1.99,
    category: 'drinks',
  },
  {
    id: 'pop-2l',
    name: 'Pop (2L Bottle)',
    description: 'Coke, Pepsi, Sprite, Ginger Ale, Root Beer, etc.',
    price: 3.99,
    category: 'drinks',
  },
  {
    id: 'bottled-water',
    name: 'Bottled Water',
    description: '500ml bottle',
    price: 1.99,
    category: 'drinks',
  },
  {
    id: 'juice',
    name: 'Juice',
    description: 'Orange, Apple, or Cranberry',
    price: 2.99,
    category: 'drinks',
  },
  {
    id: 'iced-tea',
    name: 'Iced Tea',
    description: 'Freshly brewed iced tea',
    price: 2.99,
    category: 'drinks',
  },
  {
    id: 'dip-ranch',
    name: 'Ranch Dip',
    description: 'Creamy ranch dipping sauce',
    price: 1.49,
    category: 'drinks',
  },
  {
    id: 'dip-garlic',
    name: 'Garlic Dip',
    description: 'Creamy garlic dipping sauce',
    price: 1.49,
    category: 'drinks',
  },
  {
    id: 'dip-marinara',
    name: 'Marinara Sauce',
    description: 'Tomato marinara dipping sauce',
    price: 1.49,
    category: 'drinks',
  },
  {
    id: 'dip-blue-cheese',
    name: 'Blue Cheese Dip',
    description: 'Creamy blue cheese dipping sauce',
    price: 1.49,
    category: 'drinks',
  },
  {
    id: 'dip-bbq',
    name: 'BBQ Sauce',
    description: 'Tangy BBQ dipping sauce',
    price: 1.49,
    category: 'drinks',
  },
  {
    id: 'dip-hot-sauce',
    name: 'Hot Sauce',
    description: 'Spicy hot sauce',
    price: 1.49,
    category: 'drinks',
  },

  // ========== SPECIAL DEALS ==========
  {
    id: 'small-pizza-deal',
    name: 'Small Pizza Special',
    description: 'Small 10" pizza with up to 3 toppings',
    price: 9.99,
    category: 'deals',
  },
  {
    id: 'medium-pizza-deal',
    name: '2 Medium Pizzas Deal',
    description: 'Any 2 medium 12" pizzas with up to 3 toppings each',
    price: 29.99,
    category: 'deals',
    popular: true,
  },
  {
    id: 'large-pizza-deal',
    name: '2 Large Pizzas Deal',
    description: 'Any 2 large 14" pizzas with up to 3 toppings each',
    price: 36.99,
    category: 'deals',
    popular: true,
  },
  {
    id: 'xlarge-pizza-deal',
    name: '2 X-Large Pizzas Deal',
    description: 'Any 2 x-large 16" pizzas with up to 3 toppings each',
    price: 44.99,
    category: 'deals',
    popular: true,
  },
  {
    id: 'triple-pizza-deal',
    name: '3 Medium Pizzas Deal',
    description: 'Any 3 medium pizzas with up to 3 toppings each',
    price: 42.99,
    category: 'deals',
  },
  {
    id: 'pizza-wings-combo',
    name: 'Pizza & Wings Combo',
    description: '1 large pizza with 3 toppings, 1 lb wings, 2L pop',
    price: 34.99,
    category: 'deals',
  },
  {
    id: 'family-meal',
    name: 'Family Meal Deal',
    description: '2 large pizzas, 10 wings, garlic bread, 2L pop',
    price: 49.99,
    category: 'deals',
    popular: true,
  },
  {
    id: 'party-pack',
    name: 'Party Pack',
    description: '3 large pizzas, 20 wings, garlic bread with cheese, 2L pop',
    price: 69.99,
    category: 'deals',
  },
  {
    id: 'super-party-pack',
    name: 'Super Party Pack',
    description:
      '4 large pizzas, 3 lbs wings, 2 garlic breads with cheese, 2x 2L pop',
    price: 89.99,
    category: 'deals',
  },
  {
    id: 'walk-in-special',
    name: 'Walk-In Special',
    description: 'Pizza slice + can of pop (dine-in/walk-in only)',
    price: 5.99,
    category: 'deals',
  },
  {
    id: 'lunch-special',
    name: 'Lunch Special',
    description: 'Small pizza with 2 toppings + can of pop',
    price: 11.99,
    category: 'deals',
  },
];

// Helper function to get items by category
export const getItemsByCategory = (categoryId) => {
  return menuItems.filter((item) => item.category === categoryId);
};

// Helper function to get popular items
export const getPopularItems = () => {
  return menuItems.filter((item) => item.popular);
};

// Helper function to get all pizza sizes
export const getPizzaSizes = () => [
  'Small 10"',
  'Medium 12"',
  'Large 14"',
  'X-Large 16"',
];

// Helper function to format price
export const formatPrice = (price) => {
  return `$${Number(price).toFixed(2)}`;
};

// Helper function to get price for item with size
export const getItemPrice = (item, size) => {
  if (item?.sizes && size) {
    const sizeOption = item.sizes.find((s) => s.size === size);
    return sizeOption ? sizeOption.price : item.price;
  }
  return item.price;
};

// Helper function to get wing sauces
export const getWingSauces = () => [
  'Hot',
  'Medium',
  'Mild',
  'Honey Garlic',
  'BBQ',
  'Teriyaki',
  'Salt & Pepper',
  'Lemon Pepper',
  'Cajun',
  'Sweet Chili',
];

// Helper function to search menu items
export const searchMenuItems = (query) => {
  const lowercaseQuery = (query || '').toLowerCase();
  return menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      (item.description || '').toLowerCase().includes(lowercaseQuery)
  );
};
