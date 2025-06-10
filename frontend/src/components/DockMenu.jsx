// src/components/DockMenu.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import LazyIcon from "./LazyIcon";

export default function DockMenu() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const items = [
    {
      label: 'Home',
      icon: (
        <LazyIcon name="FaHome" className="size-[1.2em] text-primary group-hover:text-secondary" />
      ),
      path: '/dashboard',
    },
    {
      label: 'Servers',
      icon: (
        <LazyIcon name="RiServerFill" className="size-[1.2em] text-primary group-hover:text-secondary" />
      ),
      path: '/guilds',
    },
    {
      label: 'About',
      icon: (
        <LazyIcon name="FaInfo" className="size-[1.2em] text-primary group-hover:text-secondary" />
      ),
      path: '/about',
    },
  ];

  return (
    <div className="dock">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`group ${pathname === item.path ? 'dock-active' : ''}`}
        >
          {item.icon}
          <span className="dock-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
}