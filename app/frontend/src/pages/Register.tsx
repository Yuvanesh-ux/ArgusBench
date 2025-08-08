import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

type FormData = { email: string; password: string; firstName: string; lastName: string };

export default function Register() {
  const { register: reg, handleSubmit } = useForm<FormData>();
  const { register: signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    await signup(data);
    navigate('/');
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-lg font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <input className="w-full border rounded px-3 py-2" {...reg('firstName', { required: true })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <input className="w-full border rounded px-3 py-2" {...reg('lastName', { required: true })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" {...reg('email', { required: true })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2" type="password" {...reg('password', { required: true, minLength: 8 })} />
        </div>
        <button className="w-full bg-primary-600 text-white rounded px-3 py-2" type="submit">Create account</button>
      </form>
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-primary-600">Login</Link></p>
    </div>
  );
}


