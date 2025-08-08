import { Link, useLocation } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/team', label: 'Team' },
  { to: '/settings', label: 'Settings' },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="w-56 shrink-0 h-[calc(100vh-56px)] border-r bg-white">
      <nav className="p-3 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded ${active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


