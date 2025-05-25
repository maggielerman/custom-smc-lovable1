
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileProps {
  userId?: string;
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { user, profileData } = useAuth();
  
  if (!user && !userId) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Please sign in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  const displayName = profileData?.first_name && profileData?.last_name 
    ? `${profileData.first_name} ${profileData.last_name}`
    : user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : 'User';

  const username = profileData?.email || user?.primaryEmailAddress?.emailAddress || 'No email';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profileData?.avatar_url || user?.imageUrl} />
            <AvatarFallback>
              {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-gray-500">{username}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
