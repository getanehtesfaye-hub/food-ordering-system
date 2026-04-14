const { query, insert } = require('./src/config/database');

const remainingFoods = [
  {
    name: 'Veggie Burger',
    description: 'Delicious vegetarian burger with fresh vegetables and special sauce',
    price: 10.99,
    category_id: 1, // Burgers
    is_available: 1
  },
  {
    name: 'Hawaiian Pizza',
    description: 'Tropical pizza with ham, pineapple, and mozzarella cheese',
    price: 16.99,
    category_id: 2, // Pizza
    is_available: 1
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings with your choice of sauce',
    price: 8.99,
    category_id: 1, // Burgers
    is_available: 1
  },
  {
    name: 'Greek Salad',
    description: 'Traditional Greek salad with feta cheese, olives, and Mediterranean herbs',
    price: 7.99,
    category_id: 6, // Salads
    is_available: 1
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted garlic bread with herbs and butter',
    price: 3.99,
    category_id: 3, // Appetizers
    is_available: 1
  },
  {
    name: 'Mushroom Soup',
    description: 'Creamy mushroom soup with fresh herbs and croutons',
    price: 5.99,
    category_id: 3, // Appetizers
    is_available: 1
  },
  {
    name: 'Lemonade',
    description: 'Freshly squeezed lemonade with natural sweeteners',
    price: 3.49,
    category_id: 4, // Drinks
    is_available: 1
  },
  {
    name: 'Chocolate Milkshake',
    description: 'Thick chocolate milkshake with whipped cream and cherry',
    price: 6.99,
    category_id: 4, // Drinks
    is_available: 1
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian coffee-flavored dessert with cocoa powder and mascarpone',
    price: 7.99,
    category_id: 5, // Desserts
    is_available: 1
  },
  {
    name: 'Apple Pie',
    description: 'Traditional apple pie with cinnamon and butter crust',
    price: 8.99,
    category_id: 5, // Desserts
    is_available: 1
  },
  {
    name: 'Fish Tacos',
    description: 'Crispy fish tacos with cabbage slaw and lime',
    price: 9.99,
    category_id: 1, // Burgers
    is_available: 1
  },
  {
    name: 'Spring Rolls',
    description: 'Fresh vegetable spring rolls with sweet chili sauce',
    price: 6.99,
    category_id: 3, // Appetizers
    is_available: 1
  }
];

async function addFoods() {
  try {
    console.log('Adding new food items to database...');
    
    for (const food of remainingFoods) {
      const result = await insert(
        'INSERT INTO food_items (name, description, price, category_id, is_available, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [food.name, food.description, food.price, food.category_id, food.is_available]
      );
      
      if (result) {
        console.log(`✅ Added: ${food.name}`);
      } else {
        console.log(`❌ Failed to add: ${food.name}`);
      }
    }
    
    console.log('Food addition complete!');
  } catch (error) {
    console.error('Error adding foods:', error);
  }
}

addFoods();
