'use client';

import Link from "next/link";

export default function Product({ product }) {
    
  return ( 
    <>
      <Link 
        href={'/product/${product.id}'}
        className="max-w-[200px] p-1.5 border border-gray-50 hover:border-gray-200 hover:shadow-xl bg-gray-100 rounded mx-auto flex flex-col rounded-lg"
    >
        {product.url && <img className="rounded cursor-pointer" src={product.url + '/190'} />}

        <div className="flex-grow pt-2 px-1">
            <div className="font-semibold text-[15px] hover:underline cursor-pointer">{product?.title}</div>
        </div>

        <div className="flex justify-between items-end px-1">
            <div className="font-extrabold text-left">Price</div>

            <div className="relative flex items-center text-[12px] text-gray-500">
                <div className="font-extrabold text-left">${(product?.price / 100).toFixed(2)}</div>
            </div>
        </div>
      </Link>
    </>
  );
};
