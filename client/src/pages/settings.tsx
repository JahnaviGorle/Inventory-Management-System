import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  companyName: string;
  contactEmail: string;
  lowStockThreshold: number;
  currency: string;
  timezone: string;
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    companyName: "InventoryPro Inc.",
    contactEmail: "admin@inventorypro.com",
    lowStockThreshold: 10,
    currency: "INR",
    timezone: "Asia/Kolkata"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings persistence
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleInputChange = (field: keyof Settings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title">Settings</h1>
        <p className="card-subtitle">Configure your inventory management preferences</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 'var(--spacing-6)', maxWidth: '600px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                className="form-input"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                className="form-input"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lowStockThreshold">Default Low Stock Threshold</label>
              <input
                type="number"
                id="lowStockThreshold"
                className="form-input"
                value={settings.lowStockThreshold}
                onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currency">Currency</label>
              <select
                id="currency"
                className="form-input"
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                required
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                className="form-input"
                value={settings.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                required
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>

            <div>
              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
