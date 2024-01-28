'use client';

import Link from "next/link";

export default function Product({ product }) {
    
  return ( 
    <>
      <Link 
        href={'/product/${product.id}'}
        className="max-w-[200px] p-1.5 border border-custom-color hover:border-gray-200 hover:shadow-xl bg-custom-color rounded mx-auto flex flex-col rounded-lg"
    >
        {product.url && <img className="rounded cursor-pointer" src={product.url + '/190'} />}

        <div className="flex-grow pt-2 px-1">
            <div className="font-semibold text-[15px] hover:underline cursor-pointer"></div>
        </div>

        <div className="flex justify-between items-end px-1">
            <div className="font-bold text-left text-white">{product?.title}</div>

            <div className="relative flex items-center text-[12px] text-white">
                <div className="font-extrabold text-left">${(product?.price / 100).toFixed(2)}</div>
            </div>
        </div>
      </Link>
    </>
  );
};
