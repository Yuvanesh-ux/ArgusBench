import { useAuth } from '@/components/auth/AuthProvider';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Profile</h1>
      <pre className="bg-white p-4 rounded border text-sm">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}


