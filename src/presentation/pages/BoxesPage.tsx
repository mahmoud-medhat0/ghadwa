
import React, { useEffect } from 'react';
import { BoxCard } from '@/presentation/features/home/BoxCard';
import { useData } from '@/application/context/DataContext';
import { useCart } from '@/application/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/presentation/components/shared/PageHeader';
import { EmptyState } from '@/presentation/components/shared/EmptyState';

export const BoxesPage: React.FC = () => {
    const { boxes, chefs } = useData();
    const { cart, updateQuantity } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-warm-50 pt-28 pb-16 animate-fade-in relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pattern-dots pointer-events-none text-primary-900"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <PageHeader
                    title="بوكسات"
                    highlightedText="بس"
                    description="جمعنالك أحلى الأكلات في بوكسات توفر عليك، تشبعك، وتحلي لمتك مع العيلة والأصحاب."
                />

                {boxes.length === 0 ? (
                    <EmptyState
                        icon="fa-solid fa-box-open"
                        title="قريباً.. بوكسات جديدة"
                        description="انتظروا أقوى العروض والبوكسات قريباً"
                        color="primary"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {boxes.map(box => (
                            <BoxCard
                                key={box.id}
                                box={box}
                                cart={cart}
                                updateQuantity={updateQuantity}
                                isOpen={true}
                                chefs={chefs}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

