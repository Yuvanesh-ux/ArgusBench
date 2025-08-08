import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
      <Link className="text-primary-600" to="/">Go home</Link>
    </div>
  );
}


