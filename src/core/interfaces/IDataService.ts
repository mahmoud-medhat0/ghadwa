import { Chef, Order, Product, Box, PromoCode, ContactSettings, MenuItem } from '@/core/domain/entities';

export interface IDataService {
    // Read
    getChefs(): Promise<Chef[]>;
    getOrders(): Promise<Order[]>;
    getMenuItems(): Promise<Product[]>;
    getOffers(): Promise<Product[]>;
    getBoxes(): Promise<Box[]>;
    getBestSellers(): Promise<Product[]>;
    getPromoCodes(): Promise<PromoCode[]>;
    getContactSettings(): Promise<ContactSettings>;
    getPartners(): Promise<any[]>;

    // Write / Actions
    submitOrder(order: any): Promise<boolean>;
    addReview(review: any): Promise<boolean>;
}
