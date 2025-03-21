
import React from 'react';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

const UserInactivityHandler: React.FC = () => {
  const { TimeoutWarningDialog } = useInactivityTimeout();
  
  // This component acts as a wrapper to manage user inactivity timeout
  return <TimeoutWarningDialog />;
};

export default UserInactivityHandler;
