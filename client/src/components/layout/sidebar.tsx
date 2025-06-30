import { Link, useLocation } from "wouter";

const navigation = [
  { name: "Dashboard", href: "/", icon: "📊" },
  { name: "Products", href: "/products", icon: "📦" },
  { name: "Reports", href: "/reports", icon: "📈" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">I</div>
        <span className="logo-text">InventoryPro</span>
      </div>
      
      <nav>
        <ul className="nav-list">
          {navigation.map((item) => (
            <li key={item.name} className="nav-item">
              <Link href={item.href} className={`nav-link ${location === item.href ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
