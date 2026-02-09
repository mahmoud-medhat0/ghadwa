
import React, { useEffect } from 'react';
import { AddToCartButton } from '@/presentation/components/ui/UIHelpers';
import { UnifiedProductCard } from '@/presentation/features/home/UnifiedProductCard';
import { useData } from '@/application/context/DataContext';
import { useCart } from '@/application/context/CartContext';
import { PageHeader } from '@/presentation/components/shared/PageHeader';

export const HealthyPage: React.FC = () => {
    const { menuItems, chefs } = useData();
    const { cart, updateQuantity } = useCart();

    const items = menuItems.filter(item => item.category === 'healthy' || item.name.includes('صحي') || item.description?.includes('صحي'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isChefOpen = (chefId?: string): boolean => {
        if (!chefId) return true;
        const chef = chefs.find(c => c.id === chefId);
        return chef?.is_active !== false;
    };

    return (
        <div className="min-h-screen bg-warm-50 pt-28 pb-16 animate-fade-in relative">
            <div className="absolute inset-0 pattern-dots opacity-5 text-primary-900 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <PageHeader
                    title="هيلثي &"
                    highlightedText="دايت"
                    description="تشكيلة مميزة من الأكل الصحي، قليل السعرات، والمطبوخ بأعلى معايير الجودة عشان تستمتع بطعم رائع وضمير مرتاح."
                />

                {items.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-primary-200 rounded-3xl bg-white/50">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-primary-500">
                            <i className="fa-solid fa-carrot"></i>
                        </div>
                        <p className="text-xl font-bold text-gray-800 mb-2">قريباً.. قائمة الهيلثي</p>
                        <p className="text-gray-600">نجهز لكم أشهى الأطباق الصحية حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {items.map(item => (
                            <div key={item.id} className="h-full">
                                <UnifiedProductCard
                                    item={item}
                                    cart={cart}
                                    updateQuantity={updateQuantity}
                                    badgeLabel="صحي"
                                    badgeIcon="fa-solid fa-leaf"
                                    badgeColor="bg-green-600"
                                    isChefOpen={isChefOpen(item.chef_id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


