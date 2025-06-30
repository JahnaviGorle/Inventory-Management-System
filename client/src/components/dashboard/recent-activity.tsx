export default function RecentActivity() {
  // Mock activity data for now - in a real app this would come from API
  const activities = [
    {
      id: 1,
      icon: "📦",
      text: "Added 50 units of iPhone 14 Pro to inventory",
      time: "2 hours ago",
      type: "primary"
    },
    {
      id: 2,
      icon: "⚠️",
      text: "Low stock alert for Cotton T-Shirt",
      time: "4 hours ago",
      type: "warning"
    },
    {
      id: 3,
      icon: "🚫",
      text: "MacBook Pro is now out of stock",
      time: "6 hours ago",
      type: "danger"
    },
    {
      id: 4,
      icon: "✅",
      text: "Bulk import of 150 products completed",
      time: "Yesterday",
      type: "success"
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Recent Activity</h2>
        <p className="card-subtitle">Latest inventory changes</p>
      </div>
      <div className="card-content">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className={`activity-icon ${activity.type}`}>
              <span>{activity.icon}</span>
            </div>
            <div className="activity-content">
              <p className="activity-text">{activity.text}</p>
              <p className="activity-time">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
