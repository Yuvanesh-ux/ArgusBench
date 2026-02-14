import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

export default function Profile() {
  const { user } = useAuth();
  const [altUser, setAltUser] = useState<any | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUserId = params.get('userId');
    // Only allow fetching user data if the requested userId matches the authenticated user's id
    if (targetUserId && user && targetUserId === user.id) {
      api.get(`/users/${targetUserId}`).then((res) => setAltUser(res.data.data.user)).catch(() => {});
    }
  }, [user]);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Profile</h1>
      <pre className="bg-white p-4 rounded border text-sm">{JSON.stringify(altUser ?? user, null, 2)}</pre>
    </div>
  );
}
