import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  CheckCircle
} from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { Card, CardBody, CardTitle } from '../components/UI/Card';
import theme from '../styles/theme';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UsersManagementContainer = styled.div`
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

const RoleFilter = styled.select`
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
`;

const UserCard = styled(Card)`
  position: relative;
  overflow: hidden;
  transition: transform ${theme.transitions.normal};
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.primary}10 0%, ${theme.colors.primaryDark}10 100%);
  border-bottom: 1px solid ${theme.colors.gray[200]};
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.secondary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const UserRole = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  margin-bottom: ${theme.spacing.xs};
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.role) {
      case 'admin':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      case 'user':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      default:
        return `
          background-color: ${theme.colors.gray[500]}20;
          color: ${theme.colors.gray[500]};
        `;
    }
  }}
`;

const UserStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          color: ${theme.colors.success};
        `;
      case 'banned':
        return `
          color: ${theme.colors.error};
        `;
      default:
        return `
          color: ${theme.colors.gray[500]};
        `;
    }
  }}
`;

const UserContent = styled(CardBody)`
  padding: ${theme.spacing.lg};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const DetailIcon = styled.div`
  color: ${theme.colors.primary};
  flex-shrink: 0;
`;

const UserStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const UserActions = styled.div`
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

const AdminUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'banned', label: 'Banned' }
  ];

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAll();
        
        if (response.success) {
          // Transform API data to match frontend structure
          const transformedUsers = response.data.users.map(user => ({
            id: user.id,
            firstName: user.username.split(' ')[0] || user.username,
            lastName: user.username.split(' ')[1] || '',
            email: user.email,
            phone: user.phone || 'Not provided',
            role: user.role,
            status: 'active', // Default status since API doesn't provide it
            joinDate: new Date(user.created_at),
            lastLogin: new Date(), // API doesn't provide this
            totalOrders: 0, // API doesn't provide this
            totalSpent: 0 // API doesn't provide this
          }));
          
          setUsers(transformedUsers);
          setFilteredUsers(transformedUsers);
        } else {
          toast.error('Failed to load users');
        }
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Error loading users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, selectedStatus, users]);

  const handleToggleStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = user.status === 'active' ? 'banned' : 'active';
      const response = await userAPI.updateRole(userId, newStatus);
      
      if (response.success) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: newStatus } : u
        ));
        toast.success(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`);
      } else {
        toast.error(response.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <UsersManagementContainer>
        <LoadingMessage>Loading users...</LoadingMessage>
      </UsersManagementContainer>
    );
  }

  return (
    <UsersManagementContainer>
      <ManagementHeader>
        <HeaderTitle>
          <ManagementTitle>Users Management</ManagementTitle>
          <ManagementSubtitle>Manage user accounts and permissions</ManagementSubtitle>
        </HeaderTitle>
        <HeaderActions>
          <Button>
            <UserPlus size={20} />
            Add User
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
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterContainer>
          <Filter size={20} style={{ color: theme.colors.gray[500] }} />
          <RoleFilter
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </RoleFilter>
          
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

      {filteredUsers.length === 0 ? (
        <EmptyMessage>
          No users found matching your criteria.
        </EmptyMessage>
      ) : (
        <UsersGrid>
          {filteredUsers.map(user => (
            <UserCard key={user.id}>
              <UserHeader>
                <UserAvatar>
                  {getInitials(user.firstName, user.lastName)}
                </UserAvatar>
                <UserInfo>
                  <UserName>{user.firstName} {user.lastName}</UserName>
                  <UserRole>
                    <RoleBadge role={user.role}>
                      <Shield size={14} />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </RoleBadge>
                  </UserRole>
                  <UserStatus status={user.status}>
                    {user.status === 'active' ? (
                      <>
                        <CheckCircle size={14} />
                        Active
                      </>
                    ) : (
                      <>
                        <Ban size={14} />
                        Banned
                      </>
                    )}
                  </UserStatus>
                </UserInfo>
              </UserHeader>
              
              <UserContent>
                <UserDetails>
                  <DetailItem>
                    <DetailIcon>
                      <Mail size={16} />
                    </DetailIcon>
                    {user.email}
                  </DetailItem>
                  <DetailItem>
                    <DetailIcon>
                      <Phone size={16} />
                    </DetailIcon>
                    {user.phone}
                  </DetailItem>
                  <DetailItem>
                    <DetailIcon>
                      <Calendar size={16} />
                    </DetailIcon>
                    Joined {formatDate(user.joinDate)}
                  </DetailItem>
                </UserDetails>
                
                <UserStats>
                  <StatItem>
                    <StatValue>{user.totalOrders}</StatValue>
                    <StatLabel>Total Orders</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{formatCurrency(user.totalSpent)}</StatValue>
                    <StatLabel>Total Spent</StatLabel>
                  </StatItem>
                </UserStats>
                
                <UserActions>
                  <ActionButton variant="outline">
                    <Eye size={16} />
                    View
                  </ActionButton>
                  <ActionButton variant="outline">
                    <Edit2 size={16} />
                    Edit
                  </ActionButton>
                  <ActionButton 
                    variant="outline" 
                    onClick={() => handleToggleStatus(user.id)}
                    style={{ 
                      color: user.status === 'active' ? theme.colors.error : theme.colors.success 
                    }}
                  >
                    {user.status === 'active' ? (
                      <>
                        <Ban size={16} />
                        Ban
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Activate
                      </>
                    )}
                  </ActionButton>
                  <ActionButton 
                    variant="outline" 
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ color: theme.colors.error }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </ActionButton>
                </UserActions>
              </UserContent>
            </UserCard>
          ))}
        </UsersGrid>
      )}
    </UsersManagementContainer>
  );
};

export default AdminUsersManagement;
