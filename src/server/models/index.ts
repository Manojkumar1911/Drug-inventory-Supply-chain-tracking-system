
import { Pool } from 'pg';
import AlertModel from './Alert';
import LocationModel from './Location';
import UserModel from './User';
import ProductModel from './Product';
import SupplierModel from './Supplier';
import PurchaseOrderModel from './PurchaseOrder';
import TransferModel from './Transfer';
import SettingsModel from './Settings';

// This factory function creates all our models with a shared pool
export function createModels(pool: Pool) {
  return {
    Alert: new AlertModel(pool),
    Location: new LocationModel(pool),
    User: new UserModel(pool),
    Product: new ProductModel(pool),
    Supplier: new SupplierModel(pool),
    PurchaseOrder: new PurchaseOrderModel(pool),
    Transfer: new TransferModel(pool),
    Settings: new SettingsModel(pool)
  };
}
