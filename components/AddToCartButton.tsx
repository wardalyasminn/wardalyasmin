"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddToCartButtonProps {
  id: string;
    name: string;
      price: number;
        image_url?: string;
        }

        export default function AddToCartButton({ id, name, price, image_url }: AddToCartButtonProps) {
          const { addItem } = useCart();
            const { t } = useLanguage();
              const [added, setAdded] = useState(false);

                const handleClick = () => {
                    addItem({ id, name, price, image_url });
                        setAdded(true);
                            setTimeout(() => setAdded(false), 1500);
                              };

                                return (
                                    <button
                                          onClick={handleClick}
                                                className={`w-full font-bold py-4 rounded-2xl transition-all ${
                                                        added ? "bg-green-500 text-white" : "bg-gray-50 text-gray-800 hover:bg-[#d4637d] hover:text-white"
                                                              }`}
                                                                  >
                                                                        {added ? t("added_to_cart") : t("add_to_cart")}
                                                                            </button>
                                                                              );
                                                                              }