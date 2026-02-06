
import { IDataService } from '@/core/interfaces/IDataService';
import { Chef, Order, Product, Box, PromoCode, ContactSettings } from '@/core/domain/entities';
import { supabase } from '../supabase/client';
import { logger } from '@/infrastructure/logging/logger';

import { MOCK_MENU, MOCK_BOXES, MOCK_CHEFS, MOCK_PROMOS, MOCK_SETTINGS } from '@/infrastructure/api/mockData';

export const supabaseDataService: IDataService = {
    // --- Read ---
    getChefs: async (): Promise<Chef[]> => {
        const { data, error } = await supabase.from('chefs').select('*');
        if (error || !data || data.length === 0) {
            // logger.error('SUPABASE', 'Error fetching chefs or empty', error);
            return MOCK_CHEFS;
        }

        // Map DB columns to entity fields
        return (data || []).map((dbChef: any) => ({
            id: dbChef.id,
            chef_name: dbChef.name, // DB: name, Entity: chef_name
            specialty: dbChef.specialty,
            description: dbChef.bio, // DB: bio, Entity: description
            image_url: dbChef.img,   // DB: img, Entity: image_url
            cover_image_url: dbChef.cover, // DB: cover, Entity: cover_image_url
            working_hours: dbChef.working_hours,
            delivery_time: dbChef.delivery_time,
            rating: dbChef.rating,
            // Use DB value (is_open) but default to true if missing
            is_active: dbChef.is_open ?? true
        })) as Chef[];
    },

    getOrders: async (): Promise<Order[]> => {
        const { data, error } = await supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
        if (error) {
            logger.error('SUPABASE', 'Error fetching orders', error);
            return [];
        }
        return data as Order[] || [];
    },

    getMenuItems: async (): Promise<Product[]> => {
        // Use 'menu_items' as primary table based on diagnostic
        const { data, error } = await supabase.from('menu_items').select('*');

        let items: Product[] = [];

        if (!error && data && data.length > 0) {
            // Map 'menu_items' columns to Product entity if needed
            items = data.map((item: any) => {
                // Helper to determine category if missing or needing inference
                let category = item.category;

                // If category is missing or generic, try to infer from name/description
                if (!category || category === 'طواجن') {
                    const name = (item.name || '').toLowerCase();
                    const desc = (item.description || '').toLowerCase();

                    if (name.includes('صحي') || desc.includes('صحي') || name.includes('healthy')) {
                        category = 'healthy';
                    } else if (name.includes('مجمد') || desc.includes('مجمد') || name.includes('تجهيز') || name.includes('frozen')) {
                        category = 'frozen';
                    } else {
                        category = category || 'طواجن'; // Fallback to existing or default
                    }
                }

                return {
                    ...item,
                    // Map mismatched columns
                    image_url: item.img,
                    prep_time: parseInt(item.time) || 0, // '45 د' -> 45
                    category: category,

                    // Ensure boolean flags
                    is_available: item.is_available ?? true,
                    is_offer: item.is_offer ?? false,
                    is_featured: item.is_featured ?? false
                };
            }) as Product[];
        }

        // Merge Mock Data if categories are missing (Hybrid Approach)
        const hasHealthy = items.some(i => i.category === 'healthy');
        const hasFrozen = items.some(i => i.category === 'frozen');

        if (!hasHealthy) {
            const mockHealthy = MOCK_MENU.filter(i => i.category === 'healthy');
            items = [...items, ...mockHealthy];
        }

        if (!hasFrozen) {
            const mockFrozen = MOCK_MENU.filter(i => i.category === 'frozen');
            items = [...items, ...mockFrozen];
        }

        return items;
    },

    getOffers: async (): Promise<Product[]> => {
        const { data, error } = await supabase.from('menu_items').select('*').eq('is_offer', true);
        if (error) {
            logger.error('SUPABASE', 'Error fetching offers', error);
            return [];
        }
        // Apply same mapping
        return (data || []).map((item: any) => ({
            ...item,
            image_url: item.img,
            prep_time: parseInt(item.time) || 0,
            category: 'طواجن',
            is_available: item.is_available ?? true
        })) as Product[];
    },

    getBoxes: async (): Promise<Box[]> => {
        const { data, error } = await supabase.from('boxes').select('*');
        if (error) {
            logger.error('SUPABASE', 'Error fetching boxes', error);
            return [];
        }
        return (data || []).map((box: any) => ({
            ...box,
            image_url: box.img,
            is_active: box.is_active ?? true
        })) as Box[];
    },

    getBestSellers: async (): Promise<Product[]> => {
        // Use 'menu_items' as primary
        // Try fetching featured items first
        let { data, error } = await supabase.from('menu_items').select('*').eq('is_featured', true).order('order_count', { ascending: false });

        // Fallback: If no featured items or error, fetch any 4 items (sorted by order count)
        if (error || !data || data.length === 0) {
            const fallback = await supabase.from('menu_items').select('*').order('order_count', { ascending: false }).limit(4);
            data = fallback.data;
        }

        // Map columns
        return (data || []).map((item: any) => ({
            ...item,
            image_url: item.img,
            prep_time: parseInt(item.time) || 0,
            category: 'أطباق رئيسية', // Default category

            // Ensure boolean flags
            is_available: item.is_available ?? true,
            is_offer: item.is_offer ?? false,
            // Force true so they appear as featured in the UI list
            is_featured: true
        })) as Product[];
    },

    getPromoCodes: async (): Promise<PromoCode[]> => {
        const { data, error } = await supabase.from('promo_codes').select('*').eq('is_active', true);
        if (error) {
            logger.error('SUPABASE', 'Error fetching promo codes', error);
            return [];
        }
        return data as PromoCode[] || [];
    },

    getContactSettings: async (): Promise<ContactSettings> => {
        const { data, error } = await supabase.from('settings').select('*').limit(1).single();
        if (error) {
            // Try 'contact_settings' if 'settings' fails
            const { data: altData, error: altError } = await supabase.from('contact_settings').select('*').limit(1).single();
            if (altError) {
                logger.error('SUPABASE', 'Error fetching settings', error);
                return {} as ContactSettings;
            }
            return altData as ContactSettings;
        }
        return data as ContactSettings;
    },

    getPartners: async (): Promise<any[]> => {
        const { data, error } = await supabase.from('partners').select('*').eq('is_active', true);
        if (error) {
            // logger.error('SUPABASE', 'Error fetching partners', error); // Suppress error as table might not exist
            return [];
        }
        return data || [];
    },

    // --- Write ---
    submitOrder: async (order: any): Promise<boolean> => {
        try {
            // This is a simplified submission. In a real app, you'd insert into 'orders' then 'order_items'
            // For now, we'll try to insert just the order if structure matches, or log it.
            // Note: To properly implement this, we need to map the UI 'order' object (CheckoutForm + Cart) to DB columns.

            // For this task, we will just log that we would submit to supabase.
            // To actually submit, we need to know the exact structure of 'order' passed here. 
            // Assuming it's the `Order` entity (which has items as OrderItem[]), we can try:

            const { itemsDetails, ...orderData } = order;

            // Clean up legacy/UI fields before sending to Supabase
            const dbOrder = {
                customer_name: orderData.customer_name || orderData.name,
                customer_phone: orderData.customer_phone || orderData.phone,
                delivery_address: orderData.delivery_address || orderData.address,
                total_amount: orderData.total_amount || orderData.total,
                subtotal: orderData.subtotal,
                status: 'pending',
                // Add other fields as necessary
            };

            const { data: insertedOrder, error: orderError } = await supabase
                .from('orders')
                .insert(dbOrder)
                .select()
                .single();

            if (orderError) {
                logger.error('SUPABASE', 'Error submitting order', orderError);
                return false;
            }

            if (itemsDetails && Array.isArray(itemsDetails) && insertedOrder) {
                const itemsToInsert = itemsDetails.map((item: any) => ({
                    order_id: insertedOrder.id,
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity,
                }));

                const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
                if (itemsError) {
                    logger.error('SUPABASE', 'Error submitting order items', itemsError);
                    // potentially rollback order?
                }
            }

            return true;
        } catch (err) {
            logger.error('SUPABASE', 'Exception submitting order', err);
            return false;
        }
    },

    addReview: async (review: any): Promise<boolean> => {
        const { error } = await supabase.from('reviews').insert(review);
        if (error) {
            logger.error('SUPABASE', 'Error adding review', error);
            return false;
        }
        return true;
    }
};
