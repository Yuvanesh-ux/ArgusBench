import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

type FormData = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    await login(data.email, data.password);
    navigate('/');
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-lg font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input id="email" className="w-full border rounded px-3 py-2" type="email" {...register('email', { required: true })} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input id="password" className="w-full border rounded px-3 py-2" type="password" {...register('password', { required: true })} />
        </div>
        <button className="w-full bg-primary-600 text-white rounded px-3 py-2" type="submit">Login</button>
      </form>
      <p className="text-sm mt-3">No account? <Link to="/register" className="text-primary-600">Register</Link></p>
    </div>
  );
}


