import React, { useEffect } from 'react';
import { useData } from '@/application/context/DataContext';
import { useCart } from '@/application/context/CartContext';
import { PageHeader } from '@/presentation/components/shared/PageHeader';
import { UnifiedProductCard } from '@/presentation/features/home/UnifiedProductCard';

export const FrozenPage: React.FC = () => {
    const { menuItems } = useData();
    const { cart, updateQuantity } = useCart();
    const items = menuItems.filter(item => item.category === 'frozen' || item.name.includes('مجمد') || item.name.includes('تجهيز'));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-warm-50 pt-28 pb-16 animate-fade-in relative">
            <div className="absolute inset-0 pattern-dots opacity-5 text-primary-900 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <PageHeader
                    title="مجمدات &"
                    highlightedText="تجهيزات"
                    description="كل اللي تحتاجه ست البيت من خضروات مجمدة، تتبيلات جاهزة، ولحوم مجهزة على التسوية فوراً."
                />

                {items.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-primary-100 rounded-3xl bg-white/50">
                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-primary-400">
                            <i className="fa-regular fa-snowflake"></i>
                        </div>
                        <p className="text-xl font-bold text-gray-800 mb-2">قريباً.. قسم المجمدات</p>
                        <p className="text-gray-500">نجهز لكم أفضل المنتجات لتسهيل طبخك</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {items.map(item => (
                            <div key={item.id} className="h-full">
                                <UnifiedProductCard
                                    item={item}
                                    cart={cart}
                                    updateQuantity={updateQuantity}
                                    badgeLabel="مجمد"
                                    badgeIcon="fa-regular fa-snowflake"
                                    badgeColor="bg-[#8B2525]"
                                    themeColor="#8B2525"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


