import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Mail, Phone, MapPin, Lock, Edit2, Save, X, CreditCard, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';

const ProfileContainer = styled.div`
  min-height: calc(100vh - 140px);
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const ProfileTitle = styled.h1`
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled(Card)`
  margin-bottom: ${theme.spacing.lg};
`;

const ProfileSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.secondary};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.lg};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  gap: ${theme.spacing.md};
`;

const InfoIcon = styled.div`
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing.xs};
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[500]};
  margin-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.gray[800]};
  font-weight: ${theme.typography.fontWeight.medium};
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

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing.lg};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  text-decoration: none;
  color: inherit;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 0 auto ${theme.spacing.md};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-radius: 50%;
  font-size: ${theme.typography.fontSize.xl};
`;

const ActionTitle = styled.h4`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.secondary};
`;

const ActionDescription = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  line-height: 1.4;
`;

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.username?.split(' ')[0] || '',
    lastName: user?.username?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values
      setEditForm({
        firstName: user?.username?.split(' ')[0] || '',
        lastName: user?.username?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>
          <User size={32} />
          My Profile
        </ProfileTitle>
        <p style={{ color: theme.colors.gray[600] }}>
          Manage your account information and preferences
        </p>
      </ProfileHeader>

      <ProfileContent>
        <div>
          <ProfileCard>
            <CardBody>
              <ProfileSection>
                <SectionTitle>
                  <User size={20} />
                  Personal Information
                </SectionTitle>
                
                {isEditing ? (
                  <FormGrid>
                    <FormRow>
                      <Input
                        name="firstName"
                        label="First Name"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                      />
                      <Input
                        name="lastName"
                        label="Last Name"
                        value={editForm.lastName}
                        onChange={handleInputChange}
                      />
                    </FormRow>
                    <Input
                      name="email"
                      label="Email"
                      type="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="phone"
                      label="Phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={handleInputChange}
                    />
                  </FormGrid>
                ) : (
                  <InfoGrid>
                    <InfoItem>
                      <InfoIcon>
                        <User size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Full Name</InfoLabel>
                        <InfoValue>{user.username}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>
                        <Mail size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Email</InfoLabel>
                        <InfoValue>{user.email}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                    <InfoItem>
                      <InfoIcon>
                        <Phone size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Phone</InfoLabel>
                        <InfoValue>{user.phone || 'Not provided'}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                  </InfoGrid>
                )}
              </ProfileSection>

              <ProfileSection>
                <SectionTitle>
                  <MapPin size={20} />
                  Address Information
                </SectionTitle>
                
                {isEditing ? (
                  <FormGrid>
                    <Input
                      name="address"
                      label="Delivery Address"
                      placeholder="e.g. Bole Road, near Edna Mall, Addis Ababa"
                      value={editForm.address}
                      onChange={handleInputChange}
                    />
                  </FormGrid>
                ) : (
                  <InfoGrid>
                    <InfoItem>
                      <InfoIcon>
                        <MapPin size={20} />
                      </InfoIcon>
                      <InfoContent>
                        <InfoLabel>Address</InfoLabel>
                        <InfoValue>{user.address || 'Not provided'}</InfoValue>
                      </InfoContent>
                    </InfoItem>
                  </InfoGrid>
                )}
              </ProfileSection>

              <ButtonGroup>
                {isEditing ? (
                  <>
                    <ActionButton onClick={handleSave}>
                      <Save size={16} />
                      Save Changes
                    </ActionButton>
                    <Button variant="outline" onClick={handleEditToggle}>
                      <X size={16} />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <ActionButton onClick={handleEditToggle}>
                    <Edit2 size={16} />
                    Edit Profile
                  </ActionButton>
                )}
              </ButtonGroup>
            </CardBody>
          </ProfileCard>
        </div>

        <div>
          <ProfileCard>
            <CardBody>
              <SectionTitle>
                <Lock size={20} />
                Security
              </SectionTitle>
              <Button variant="outline" fullWidth style={{ marginBottom: theme.spacing.md }}>
                <Lock size={16} style={{ marginRight: theme.spacing.sm }} />
                Change Password
              </Button>
              <Button variant="outline" fullWidth onClick={handleLogout}>
                <LogOut size={16} style={{ marginRight: theme.spacing.sm }} />
                Sign Out
              </Button>
            </CardBody>
          </ProfileCard>

          <ProfileCard>
            <CardBody>
              <SectionTitle>Quick Actions</SectionTitle>
              <QuickActions>
                <QuickActionCard as="a" href="/orders">
                  <ActionIcon>
                    <ShoppingBag size={24} />
                  </ActionIcon>
                  <ActionTitle>Order History</ActionTitle>
                  <ActionDescription>View your past orders</ActionDescription>
                </QuickActionCard>
                
                <QuickActionCard as="a" href="/profile/payment">
                  <ActionIcon>
                    <CreditCard size={24} />
                  </ActionIcon>
                  <ActionTitle>Payment Methods</ActionTitle>
                  <ActionDescription>Manage payment options</ActionDescription>
                </QuickActionCard>
              </QuickActions>
            </CardBody>
          </ProfileCard>
        </div>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default ProfilePage;
