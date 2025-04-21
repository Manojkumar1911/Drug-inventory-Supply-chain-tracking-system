
-- Database schema for inventory management system

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip_code VARCHAR(50) NOT NULL,
  country VARCHAR(255) NOT NULL DEFAULT 'USA',
  phone_number VARCHAR(50),
  email VARCHAR(255),
  manager VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  expiry_date TIMESTAMP,
  reorder_level INTEGER NOT NULL,
  manufacturer VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  zip_code VARCHAR(50) NOT NULL,
  country VARCHAR(255) DEFAULT 'USA',
  tax_id VARCHAR(255),
  payment_terms VARCHAR(255),
  lead_time INTEGER,
  minimum_order_amount DECIMAL(10, 2),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Products junction table
CREATE TABLE IF NOT EXISTS supplier_products (
  supplier_id INTEGER REFERENCES suppliers(id),
  product_id INTEGER REFERENCES products(id),
  PRIMARY KEY (supplier_id, product_id)
);

-- Purchase Order Items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id SERIAL PRIMARY KEY,
  purchase_order_id INTEGER NOT NULL,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(255) UNIQUE NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  supplier_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  submitted_by VARCHAR(255) NOT NULL,
  approved_by VARCHAR(255),
  expected_delivery_date TIMESTAMP,
  received_date TIMESTAMP,
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'Unpaid',
  payment_due_date TIMESTAMP,
  payment_method VARCHAR(255),
  payment_reference VARCHAR(255),
  shipping_method VARCHAR(255),
  tracking_number VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint after both tables exist
ALTER TABLE purchase_order_items 
ADD CONSTRAINT fk_purchase_order 
FOREIGN KEY (purchase_order_id) 
REFERENCES purchase_orders(id);

-- Transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  requested_by VARCHAR(255) NOT NULL,
  transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_date TIMESTAMP,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Pending Approval',
  priority VARCHAR(50) DEFAULT 'Normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'New',
  category VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  metric_type VARCHAR(255) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255),
  category VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, metric_type, location, category)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT FALSE,
  updated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Imported Products table for CSV upload tracking
CREATE TABLE IF NOT EXISTS imported_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  imported_by VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'processing',
  row_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_imported_products_status ON imported_products(status);
