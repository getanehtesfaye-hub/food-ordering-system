import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Clock, Plus, Minus } from 'lucide-react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import theme from '../styles/theme';
import { foodAPI } from '../services/api';

const MenuContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
`;

const MenuHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const MenuTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const MenuSubtitle = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const SearchFilterSection = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  flex: 1;
  min-width: 300px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const CategoryFilter = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 2px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.md};
  min-width: 150px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
`;

const FoodCard = styled(Card)`
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FoodImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height:100%;
    object-fit: cover;
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background-color: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const FoodContent = styled.div`
  padding: ${theme.spacing.md};
`;

const FoodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.sm};
`;

const FoodName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.xs};
`;

const FoodCategory = styled.span`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  background-color: ${theme.colors.gray[100]};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
`;

const FoodDescription = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.sm};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.5;
`;

const FoodMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.warning};
`;

const PrepTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.sm};
`;

const FoodFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FoodPrice = styled.span`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid ${theme.colors.primary};
  background-color: ${props => props.variant === 'primary' ? theme.colors.primary : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.lg};
`;

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addItem, updateItemQuantity, getItemQuantity } = useCart();

  // Function to get image path based on food name
  const getFoodImage = (foodName, foodIndex) => {
    const name = foodName.toLowerCase();
    
    // Direct mapping for specific duplicate foods to fix immediately
    if (name.includes('chicken wings')) {
      const wingImages = [
        '/images/foods/onion-rings.jpg',
        '/images/foods/mozzarella-stick.jpg', 
        '/images/foods/coca-cola.jpg',
        '/images/foods/orange_juice.jpg'
      ];
      return wingImages[foodIndex % 4];
    }
    
    if (name.includes('veggie burger')) {
      const veggieImages = [
        '/images/foods/chicken.jpg',
        '/images/foods/salad.jpg',
        '/images/foods/drinks.jpg'
      ];
      return veggieImages[foodIndex % 3];
    }
    
    if (name.includes('hawaiian pizza')) {
      const pizzaImages = [
        '/images/foods/pizza.jpg',
        '/images/foods/lasagna.jpg',
        '/images/foods/dessert.jpg'
      ];
      return pizzaImages[foodIndex % 3];
    }
    
    // Exact name-to-image matching for other foods
    const exactMatches = {
      'coca cola': '/images/foods/coca-cola.jpg',
      'orange juice': '/images/foods/orange_juice.jpg',
      'classic burger': '/images/foods/burger.jpg',
      'bbq burger': '/images/foods/BBQ_burger.jpg',
      'cheese burger': '/images/foods/cheese-burger.jpg',
      'margherita pizza': '/images/foods/pizza-margherita.jpg',
      'pepperoni pizza': '/images/foods/Pepperoni_pizza.jpg',
      'spaghetti carbonara': '/images/foods/Spaghetti_Carbonar.jpg',
      'french fries': '/images/foods/french-fries.jpg',
      'pasta': '/images/foods/pasta.jpg',
      'salad': '/images/foods/salad.jpg',
      'onion rings': '/images/foods/onion-rings.jpg',
      'mozzarella sticks': '/images/foods/mozzarella-stick.jpg',
      'dessert': '/images/foods/dessert.jpg',
      'brownies': '/images/foods/brownies.jpg',
      'ice cream': '/images/foods/ice_cream.jpg',
      'sushi': '/images/foods/sushi.jpg'
    };
    
    // Check for exact match first
    if (exactMatches[name]) {
      return exactMatches[name];
    }
    
    // Check for partial matches
    for (const [key, value] of Object.entries(exactMatches)) {
      if (name.includes(key)) {
        return value;
      }
    }
    
    // All available images - each food gets unique image based on index
    const availableImages = [
      '/images/foods/burger.jpg',
      '/images/foods/BBQ_burger.jpg',
      '/images/foods/cheese-burger.jpg',
      '/images/foods/chicken.jpg',
      '/images/foods/pizza-margherita.jpg',
      '/images/foods/Pepperoni_pizza.jpg',
      '/images/foods/pizza.jpg',
      '/images/foods/Spaghetti_Carbonara.jpg',
      '/images/foods/pasta.jpg',
      '/images/foods/lasagna.jpg',
      '/images/foods/salad.jpg',
      '/images/foods/french-fries.jpg',
      '/images/foods/onion-rings.jpg',
      '/images/foods/mozzarella-stick.jpg',
      '/images/foods/coca-cola.jpg',
      '/images/foods/orange_juice.jpg',
      '/images/foods/drinks.jpg',
      '/images/foods/dessert.jpg',
      '/images/foods/brownies.jpg',
      '/images/foods/ice_cream.jpg',
      '/images/foods/sushi.jpg'
    ];
    
    // Use food index to ensure uniqueness for duplicates
    if (foodIndex !== undefined && foodIndex < availableImages.length) {
      // Add offset for duplicates based on food type to ensure variety
      if (name.includes('chicken wings')) {
        const wingImages = [12, 13, 14]; // onion-rings, mozzarella-stick, coca-cola
        return availableImages[wingImages[foodIndex % 3]];
      }
      if (name.includes('veggie burger')) {
        const veggieImages = [3, 15, 16]; // chicken, orange_juice, drinks
        return availableImages[veggieImages[foodIndex % 3]];
      }
      if (name.includes('hawaiian pizza')) {
        const pizzaImages = [6, 9, 10]; // pizza, lasagna, salad
        return availableImages[pizzaImages[foodIndex % 3]];
      }
      return availableImages[foodIndex];
    }
    
    // Fallback: use hash but ensure different results for similar foods
    const hashIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseIndex = Math.abs(hashIndex) % availableImages.length;
    
    // Add variation for similar foods
    if (name.includes('pizza')) {
      const pizzaVariations = [4, 5, 6]; // Different pizza images
      return availableImages[pizzaVariations[baseIndex % 3]];
    }
    if (name.includes('burger')) {
      const burgerVariations = [0, 1, 2]; // Different burger images
      return availableImages[burgerVariations[baseIndex % 3]];
    }
    
    return availableImages[baseIndex];
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Burgers', label: 'Burgers' },
    { value: 'Pizza', label: 'Pizza' },
    { value: 'Pasta', label: 'Pasta' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Drinks', label: 'Drinks' },
    { value: 'Salads', label: 'Salads' }
  ];

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        const response = await foodAPI.getAll();
        
        if (response.success) {
          console.log('Menu API Response:', response);
          const foodItems = response.data?.food_items || response.data || [];
          console.log('Menu food items:', foodItems);
          setFoods(foodItems);
          setFilteredFoods(foodItems);
        } else {
          console.error('Failed to load foods:', response.message);
          setFoods([]);
          setFilteredFoods([]);
        }
      } catch (error) {
        console.error('Error loading foods:', error);
        setFoods([]);
        setFilteredFoods([]);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  useEffect(() => {
    let filtered = foods;

    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(food => food.category_name === selectedCategory);
    }

    setFilteredFoods(filtered);
  }, [searchTerm, selectedCategory, foods]);

  const handleAddToCart = (food) => {
    addItem(food.id, 1);
  };

  const handleQuantityChange = (foodId, change) => {
    const currentQuantity = getItemQuantity(foodId);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity > 0) {
      updateItemQuantity(foodId, newQuantity);
    }
  };

  if (loading) {
    return (
      <MenuContainer>
        <LoadingSpinner />
      </MenuContainer>
    );
  }

  return (
    <MenuContainer>
      <MenuHeader>
        <MenuTitle>Our Menu</MenuTitle>
        <MenuSubtitle>Delicious food made with fresh ingredients</MenuSubtitle>
      </MenuHeader>

      <SearchFilterSection>
        <SearchContainer>
          <Input
            type="text"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
          />
        </SearchContainer>
        
        <FilterContainer>
          <Filter size={20} />
          <CategoryFilter
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </CategoryFilter>
        </FilterContainer>
      </SearchFilterSection>

      {filteredFoods.length === 0 ? (
        <EmptyMessage>
          No food items found matching your criteria.
        </EmptyMessage>
      ) : (
        <MenuGrid>
          {filteredFoods.map((food, index) => {
            const quantity = getItemQuantity(food.id);
            return (
              <FoodCard key={food.id}>
                <CardBody>
                  <FoodImage>
                    <img 
                      src={getFoodImage(food.name, index)} 
                      alt={food.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ 
                      display: 'none', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      color: theme.colors.gray[400]
                    }}>
                      <Plus size={48} />
                    </div>
                    {food.popular && <PopularBadge>Popular</PopularBadge>}
                  </FoodImage>
                  
                  <FoodContent>
                    <FoodHeader>
                      <FoodName>{food.name}</FoodName>
                      <FoodCategory>{food.category_name}</FoodCategory>
                    </FoodHeader>
                    
                    <FoodDescription>{food.description}</FoodDescription>
                    
                    <FoodMeta>
                      <Rating>
                        <Star size={16} fill="currentColor" />
                        <span>{food.rating || 4.0}</span>
                      </Rating>
                      <PrepTime>
                        <Clock size={16} />
                        <span>{food.prepTime || '15-20 min'}</span>
                      </PrepTime>
                    </FoodMeta>
                    
                    <FoodFooter>
                      <FoodPrice>${parseFloat(food.price).toFixed(2)}</FoodPrice>
                      <QuantityControls>
                        {quantity > 0 ? (
                          <>
                            <QuantityButton onClick={() => handleQuantityChange(food.id, -1)}>
                              <Minus size={16} />
                            </QuantityButton>
                            <QuantityDisplay>{quantity}</QuantityDisplay>
                            <QuantityButton onClick={() => handleQuantityChange(food.id, 1)}>
                              <Plus size={16} />
                            </QuantityButton>
                          </>
                        ) : (
                          <QuantityButton 
                            variant="primary" 
                            onClick={() => handleAddToCart(food)}
                          >
                            <ShoppingCart size={16} />
                          </QuantityButton>
                        )}
                      </QuantityControls>
                    </FoodFooter>
                  </FoodContent>
                </CardBody>
              </FoodCard>
            );
          })}
        </MenuGrid>
      )}
    </MenuContainer>
  );
};

export default MenuPage;
