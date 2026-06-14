import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Star,
  DollarSign,
  Clock,
  ChefHat,
  Package
} from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import theme from '../styles/theme';
import { foodAPI } from '../services/api';
import { formatCurrency } from '../utils/currency';

const FoodManagementContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const ManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
`;

const HeaderTitle = styled.div`
  flex: 1;
`;

const ManagementTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const ManagementSubtitle = styled.p`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.md};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
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
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.gray[400]};
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  padding-left: ${theme.spacing.xl};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
`;

const CategoryFilter = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
  }
`;

const StatusFilter = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.md};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(26, 54, 93, 0.1);
  }
`;

const FoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const FoodCard = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: transform ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FoodImage = styled.div`
  width: 100%;
  height: 180px;
  background-color: ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FoodStatus = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.status) {
      case 'available':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'unavailable':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background-color: ${theme.colors.gray[500]}20;
          color: ${theme.colors.gray[500]};
        `;
    }
  }}
`;

const FoodContent = styled(CardBody)`
  padding: ${theme.spacing.lg};
`;

const FoodHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${theme.spacing.md};
`;

const FoodName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.secondary};
  margin: 0;
  flex: 1;
`;

const FoodCategory = styled.span`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const FoodDescription = styled.p`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.5;
  font-size: ${theme.typography.fontSize.sm};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FoodMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[500]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.warning};
`;

const FoodPrice = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const FoodActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.gray[500]};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  
  &:hover {
    color: ${theme.colors.gray[700]};
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const AdminFoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Burgers',
    status: 'available',
    prepTime: '',
    rating: 4.0,
    ingredients: ''
  });

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

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setLoading(true);
        const response = await foodAPI.getAll();
        
        if (response.success) {
          console.log('API Response:', response);
          console.log('Response data:', response.data);
          const foodItems = response.data?.food_items || response.data || [];
          console.log('Food items:', foodItems);
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

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(food => {
        const status = food.is_available ? 'available' : 'unavailable';
        return status === selectedStatus;
      });
    }

    setFilteredFoods(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, foods]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddFood = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Burgers',
      status: 'available',
      prepTime: '',
      rating: 4.0,
      ingredients: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      category: food.category_name || 'Burgers',
      status: food.is_available ? 'available' : 'unavailable',
      prepTime: food.prepTime || '15-20 min',
      rating: food.rating || 4.0,
      ingredients: food.ingredients || 'Fresh ingredients'
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        const response = await foodAPI.delete(foodId);
        if (response.success) {
          setFoods(prev => prev.filter(food => food.id !== foodId));
        } else {
          alert('Failed to delete food item: ' + response.message);
        }
      } catch (error) {
        console.error('Error deleting food:', error);
        alert('Failed to delete food item');
      }
    }
  };

  const handleToggleStatus = async (foodId) => {
    try {
      const response = await foodAPI.toggleAvailability(foodId);
      if (response.success) {
        setFoods(prev => prev.map(food => 
          food.id === foodId 
            ? { ...food, is_available: !food.is_available }
            : food
        ));
      } else {
        alert('Failed to toggle food status: ' + response.message);
      }
    } catch (error) {
      console.error('Error toggling food status:', error);
      alert('Failed to toggle food status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category_id', getCategoryByName(formData.category));
      formDataToSend.append('is_available', formData.status === 'available');
      if (formData.prepTime) formDataToSend.append('prepTime', formData.prepTime);
      if (formData.ingredients) formDataToSend.append('ingredients', formData.ingredients);
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }
      
      if (editingFood) {
        response = await foodAPI.update(editingFood.id, formDataToSend);
        if (response.success) {
          setFoods(prev => prev.map(food => 
            food.id === editingFood.id 
              ? { ...food, ...response.data.food_item }
              : food
          ));
        } else {
          alert('Failed to update food item: ' + response.message);
          return;
        }
      } else {
        response = await foodAPI.create(formDataToSend);
        if (response.success) {
          setFoods(prev => [...prev, response.data.food_item]);
        } else {
          alert('Failed to create food item: ' + response.message);
          return;
        }
      }
      
      setShowModal(false);
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error saving food:', error);
      alert('Failed to save food item');
    }
  };

  // Helper function to convert category name to category ID
  const getCategoryByName = (categoryName) => {
    const categoryMap = {
      'Burgers': 1,
      'Pizza': 2, 
      'Pasta': 3,
      'Drinks': 4,
      'Desserts': 5,
      'Salads': 6
    };
    return categoryMap[categoryName] || 1; // Default to Burgers if not found
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <FoodManagementContainer>
        <LoadingMessage>Loading food items...</LoadingMessage>
      </FoodManagementContainer>
    );
  }

  return (
    <FoodManagementContainer>
      <ManagementHeader>
        <HeaderTitle>
          <ManagementTitle>Food Management</ManagementTitle>
          <ManagementSubtitle>Manage your restaurant menu items</ManagementSubtitle>
        </HeaderTitle>
        <HeaderActions>
          <Button onClick={handleAddFood}>
            <Plus size={20} />
            Add Food Item
          </Button>
        </HeaderActions>
      </ManagementHeader>

      <SearchFilterSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search for food items (e.g., Burger, Pizza, Pasta)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterContainer>
          <Filter size={20} style={{ color: theme.colors.gray[500] }} />
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
          
          <StatusFilter
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </StatusFilter>
        </FilterContainer>
      </SearchFilterSection>

      {!Array.isArray(filteredFoods) || filteredFoods.length === 0 ? (
        <EmptyMessage>
          No food items found matching your criteria.
        </EmptyMessage>
      ) : (
        <FoodGrid>
          {Array.isArray(filteredFoods) && filteredFoods.map((food, index) => (
            <FoodCard key={food.id}>
              <FoodImage>
                <img 
                  src={food.image_url ? (food.image_url.startsWith('http') ? food.image_url : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${food.image_url}`) : getFoodImage(food.name, index)} 
                  alt={food.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <ChefHat size={48} style={{ display: 'none' }} />
                <FoodStatus status={food.is_available ? 'available' : 'unavailable'}>
                  {food.is_available ? 'Available' : 'Unavailable'}
                </FoodStatus>
              </FoodImage>
              
              <FoodContent>
                <FoodHeader>
                  <FoodName>{food.name}</FoodName>
                  <FoodCategory>
                    {food.category_name || 'Unknown'}
                  </FoodCategory>
                </FoodHeader>
                
                <FoodDescription>{food.description}</FoodDescription>
                
                <FoodMeta>
                  <Rating>
                    <Star size={16} fill="currentColor" />
                    <span>{food.rating}</span>
                  </Rating>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                    <Clock size={16} />
                    <span>{food.prepTime}</span>
                  </div>
                </FoodMeta>
                
                <FoodPrice>{formatCurrency(food.price)}</FoodPrice>
                
                <FoodActions>
                  <ActionButton variant="outline" onClick={() => handleEditFood(food)}>
                    <Edit2 size={16} />
                    Edit
                  </ActionButton>
                  <ActionButton 
                    variant="outline" 
                    onClick={() => handleToggleStatus(food.id)}
                  >
                    {food.status === 'available' ? <EyeOff size={16} /> : <Eye size={16} />}
                    {food.status === 'available' ? 'Hide' : 'Show'}
                  </ActionButton>
                  <ActionButton 
                    variant="outline" 
                    onClick={() => handleDeleteFood(food.id)}
                    style={{ color: theme.colors.error }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </ActionButton>
                </FoodActions>
              </FoodContent>
            </FoodCard>
          ))}
        </FoodGrid>
      )}

      {showModal && (
        <Modal>
          <ModalContent>
            <CardBody>
              <ModalHeader>
                <ModalTitle>
                  {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                </ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>
                  ×
                </CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <Input
                    name="name"
                    label="Food Name (e.g., Classic Burger, Margherita Pizza)"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    name="description"
                    label="Description (e.g., Delicious beef patty with fresh lettuce, tomato, and special sauce)"
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <FormRow>
                    <Input
                      name="price"
                      label="Price in ETB (e.g., 280.00)"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: theme.spacing.sm, fontWeight: theme.typography.fontWeight.medium }}>
                        Category (e.g., Burgers, Pizza, Pasta, Desserts, Drinks, Salads)
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: theme.spacing.md,
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.md
                        }}
                      >
                        {categories.filter(cat => cat.value !== 'all').map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormRow>
                  
                  <FormRow>
                    <Input
                      name="prepTime"
                      label="Preparation Time (e.g., 15-20 min, 25-30 min)"
                      placeholder="e.g., 15-20 min"
                      value={formData.prepTime}
                      onChange={handleInputChange}
                    />
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: theme.spacing.sm, fontWeight: theme.typography.fontWeight.medium }}>
                        Status (e.g., Available, Unavailable)
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: theme.spacing.md,
                          border: `1px solid ${theme.colors.gray[300]}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.md
                        }}
                      >
                        {statuses.filter(status => status.value !== 'all').map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </FormRow>
                  
                  <Input
                    name="ingredients"
                    label="Ingredients (e.g., Beef, lettuce, tomato, onion, special sauce)"
                    placeholder="e.g., Beef, lettuce, tomato, onion"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                  />

                  <div style={{ display: 'grid', gap: theme.spacing.sm }}>
                    <label style={{ fontWeight: theme.typography.fontWeight.medium }}>
                      Food Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="food-image-file"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                      <Button as="label" htmlFor="food-image-file" variant="outline" type="button" style={{ cursor: 'pointer', margin: 0 }}>
                        Choose File
                      </Button>
                      <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[600] }}>
                        {selectedImage ? selectedImage.name : (editingFood?.image_url ? 'Keep current image' : 'No file chosen')}
                      </span>
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: theme.borderRadius.sm, marginLeft: 'auto' }} 
                        />
                      )}
                      {!imagePreview && editingFood?.image_url && (
                        <img 
                          src={editingFood.image_url.startsWith('http') ? editingFood.image_url : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${editingFood.image_url}`} 
                          alt="Current" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: theme.borderRadius.sm, marginLeft: 'auto' }} 
                        />
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
                    <Button type="submit">
                      {editingFood ? 'Update Food Item' : 'Add Food Item'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </FormGrid>
              </form>
            </CardBody>
          </ModalContent>
        </Modal>
      )}
    </FoodManagementContainer>
  );
};

export default AdminFoodManagement;
