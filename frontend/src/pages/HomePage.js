import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChefHat, Clock, MapPin, Star, ArrowRight, Utensils, Truck, Shield } from 'lucide-react';
import Button from '../components/UI/Button';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';
import { foodAPI } from '../services/api';
import { formatCurrency } from '../utils/currency';

const HomeContainer = styled.div`
  min-height: calc(100vh - 140px);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing.xxl} 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.2;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.xxl};
  opacity: 0.9;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  justify-content: center;
  flex-wrap: wrap;
`;

const FeaturesSection = styled.section`
  padding: ${theme.spacing.xxl} 0;
  background-color: ${theme.colors.gray[50]};
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing.xl};
  transition: transform ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto ${theme.spacing.lg};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-radius: 50%;
  font-size: ${theme.typography.fontSize['2xl']};
`;

const PopularItemsSection = styled.section`
  padding: ${theme.spacing.xxl} 0;
`;

const PopularItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const FoodCard = styled(Card)`
  overflow: hidden;
  transition: transform ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FoodImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, ${theme.colors.gray[200]} 0%, ${theme.colors.gray[300]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray[500]};
`;

const FoodContent = styled(CardBody)`
  padding: ${theme.spacing.lg};
`;

const FoodTitle = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.secondary};
`;

const FoodDescription = styled.p`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.5;
`;

const FoodPrice = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
`;

const FoodRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.warning};
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.secondaryDark} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing.xxl} 0;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.lg};
`;

const CTATitle = styled.h2`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing.lg};
`;

const CTASubtitle = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  margin-bottom: ${theme.spacing.xl};
  opacity: 0.9;
`;

const HomePage = () => {
  const features = [
    {
      icon: <Clock size={32} />,
      title: 'Fast Delivery',
      description: 'Get your food delivered within 30 minutes or less'
    },
    {
      icon: <Utensils size={32} />,
      title: 'Quality Food',
      description: 'Fresh ingredients prepared by experienced chefs'
    },
    {
      icon: <Truck size={32} />,
      title: 'Free Delivery',
      description: 'Free delivery on orders above $50'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Payment',
      description: 'Safe and secure payment methods'
    }
  ];

  const [popularItems, setPopularItems] = useState([]);

  // Local fallback images resolver
  const getFoodImage = (foodName, foodIndex) => {
    const name = foodName.toLowerCase();
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
    if (exactMatches[name]) return exactMatches[name];
    for (const [key, value] of Object.entries(exactMatches)) {
      if (name.includes(key)) return value;
    }
    const availableImages = [
      '/images/foods/burger.jpg',
      '/images/foods/BBQ_burger.jpg',
      '/images/foods/cheese-burger.jpg',
      '/images/foods/chicken.jpg',
      '/images/foods/pizza-margherita.jpg',
      '/images/foods/Pepperoni_pizza.jpg',
      '/images/foods/pizza.jpg',
      '/images/foods/Spaghetti_Carbonar.jpg',
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
    return availableImages[foodIndex % availableImages.length] || '/images/foods/burger.jpg';
  };

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await foodAPI.getPopular(4);
        if (response.success && response.data?.popular_items?.length > 0) {
          const items = response.data.popular_items.map((item, index) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: formatCurrency(item.price),
            rating: item.rating || 4.5,
            image: item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : getFoodImage(item.name, index)
          }));
          setPopularItems(items);
        } else {
          useDefaultPopular();
        }
      } catch (error) {
        console.error('Error fetching popular items:', error);
        useDefaultPopular();
      }
    };

    const useDefaultPopular = () => {
      const defaultPopular = [
        {
          name: 'Classic Burger',
          description: 'Juicy beef patty with fresh vegetables and special sauce',
          price: '$12.99',
          rating: 4.5,
          image: '/images/foods/burger.jpg'
        },
        {
          name: 'Pizza Margherita',
          description: 'Classic Italian pizza with fresh basil and mozzarella',
          price: '$16.99',
          rating: 4.9,
          image: '/images/foods/pizza-margherita.jpg'
        },
        {
          name: 'Sushi',
          description: 'Fresh sushi rolls with wasabi and ginger',
          price: '$18.99',
          rating: 4.9,
          image: '/images/foods/sushi.jpg'
        },
        {
          name: 'French Fries',
          description: 'Golden crispy french fries with sea salt',
          price: '$4.99',
          rating: 4.4,
          image: '/images/foods/french-fries.jpg'
        }
      ];
      setPopularItems(defaultPopular);
    };

    fetchPopular();
  }, []);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            <ChefHat size={48} style={{ marginRight: theme.spacing.md, verticalAlign: 'middle' }} />
            Delicious Food Delivered Fast
          </HeroTitle>
          <HeroSubtitle>
            Order from your favorite restaurants and get fresh, delicious food delivered right to your doorstep. 
            Fast, reliable, and always delicious.
          </HeroSubtitle>
          <HeroButtons>
            <Button as={Link} to="/menu" size="lg" variant="white">
              Order Now
              <ArrowRight size={20} style={{ marginLeft: theme.spacing.sm }} />
            </Button>
            <Button as={Link} to="/register" variant="outline" size="lg">
              Sign Up
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Us?</SectionTitle>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>
                {feature.icon}
              </FeatureIcon>
              <CardTitle>{feature.title}</CardTitle>
              <p style={{ color: theme.colors.gray[600], lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      <PopularItemsSection>
        <SectionTitle>Popular Items</SectionTitle>
        <PopularItemsGrid>
          {popularItems.map((item, index) => (
            <FoodCard key={index}>
              <FoodImage>
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '8px 8px 0 0'
                  }} 
                />
              </FoodImage>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodRating>
                  <Star size={16} fill="currentColor" />
                  <span>{item.rating}</span>
                </FoodRating>
                <FoodPrice>{item.price}</FoodPrice>
                <Button as={Link} to="/menu" fullWidth>
                  Order Now
                </Button>
              </FoodContent>
            </FoodCard>
          ))}
        </PopularItemsGrid>
      </PopularItemsSection>

      <CTASection>
        <CTAContent>
          <CTATitle style={{ color: theme.colors.primary}}>Ready to Order?</CTATitle>
          <CTASubtitle style={{ color: theme.colors.gray[50]}}>
            Join thousands of satisfied customers who enjoy delicious food delivered to their doorstep.
          </CTASubtitle>
          <Button as={Link} to="/menu" size="lg" variant="white">
            Browse Menu
            <ArrowRight size={20} style={{ marginLeft: theme.spacing.sm }} />
          </Button>
        </CTAContent>
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;
