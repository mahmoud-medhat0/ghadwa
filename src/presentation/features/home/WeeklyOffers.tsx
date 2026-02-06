import React from 'react';
import { MenuItem, CartItem } from '@/core/domain/entities';

interface WeeklyOffersProps {
    offers: MenuItem[];
    cart: CartItem[];
    updateQuantity: (id: number, qty: number, item?: MenuItem) => void;
}

export const WeeklyOffers: React.FC<WeeklyOffersProps> = ({ offers }) => {

    // Duplicate offers to create a dense grid effect
    const displayOffers = offers.length > 0
        ? Array(8).fill(offers).flat().slice(0, 32)
        : [];

    return (
        <section id="weekly-offers" className="py-24 bg-white overflow-hidden relative">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Text Content Side (Right) */}
                    <div className="text-right space-y-6 order-2 lg:order-1 relative z-20 px-4 lg:px-0">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                            عروض غدوة
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-lg font-normal">
                            كل اللي تحبه بأسعار مميزة. اختار بوكس التوفير أو وجبات الأسبوع، ووفر وقتك وفلوسك.
                        </p>

                        <div className="pt-4">
                            <a
                                href="#menu"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white transition-all duration-300 bg-[#8B2525] border border-transparent rounded-2xl hover:bg-[#7a2020] hover:scale-105 shadow-xl shadow-[#8B2525]/10"
                            >
                                تصفح العروض
                            </a>
                        </div>
                    </div>

                    {/* Visual Side (Left) */}
                    <div className="relative order-1 lg:order-2 w-full flex items-center justify-center lg:justify-start">
                        <div className="relative w-full max-w-[650px] transform scale-125">
                            <img
                                src="/assets/ghadwa-box.png"
                                alt="بوكس غدوة"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
