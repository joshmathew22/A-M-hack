"use client";

import CheckoutItem from "../components/CheckoutItem"
import MainLayout from "../layouts/MainLayout"
import Link from "next/link"
import { useUser } from "@/app/context/user";
import { useCart } from "../context/cart";
import { useEffect, useRef, useState } from "react";
import useIsLoading from "../hooks/useIsLoading";
import useUserAddress from "../hooks/useUserAddress";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ClientOnly from "../components/ClientOnly";
import { loadStripe } from '@stripe/stripe-js';

export default function Checkout() {

    const user = useUser();
    const cart = useCart();
    const router = useRouter()

    let stripe = useRef(null)
    let elements = useRef(null)
    let card = useRef(null)
    let clientSecret = useRef(null)

    const [addressDetails, setAddressDetails] = useState({})
    const [isLoadingAddress, setIsLoadingAddress] = useState(false)

    useEffect(() => {
        if (cart?.cartTotal() <= 0) {
            toast.error("Your cart is empty!", { autoClose: 3000 })
            return router.push('/')
        }

        useIsLoading(true)

        const getAdddress = async () => {
            if (user?.id == null || user?.id == undefined) {
                useIsLoading(false)
                return
            }

            setIsLoadingAddress(true)
            const response = await useUserAddress()
            if (response) setAddressDetails(response)
            setIsLoadingAddress(false)
        }

        getAdddress()
        setTimeout(() => stripeInit(), 300)
    }, [user])

    const stripeInit = async () => {
        stripe.current = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY || '');
    
        const response = await fetch('/api/stripe', {
            method: 'POST',
            body: JSON.stringify({ amount: cart.cartTotal() })
        })
        const result = await response.json()

        clientSecret.current = result.client_secret
        elements.current = stripe.current.elements();
        var style = {
            base: { fontSize: "18px" },
            invalid: {
                fontFamily: 'Arial, sans-serif',
                color: "#EE4B2B",
                iconColor: "#EE4B2B"
            }
        };
        card.current = elements.current.create("card", {  hidePostalCode: true, style: style });
    
        card.current.mount("#card-element");
        card.current.on("change", function (event) {
            document.querySelector("button").disabled = event.empty;
            document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
        });

        useIsLoading(false)
    }

    const pay = async (event) => {
        event.preventDefault()

        if (Object.entries(addressDetails).length == 0) {
            showError('Please add shipping address!')
            return 
        }
        
        let result = await stripe.current.confirmCardPayment(clientSecret.current, {
            payment_method: { card: card.current },
        })
    
        if (result.error) {
            showError(result.error.message)
        } else {
            useIsLoading(true)

            try {
                let response = await fetch('/api/orders/create', {
                    method: "POST",
                    body: JSON.stringify({
                        stripe_id: result.paymentIntent.id,
                        name: addressDetails.name,
                        address: addressDetails.address,
                        zipcode: addressDetails.zipcode,
                        city: addressDetails.city,
                        country: addressDetails.country,
                        budget: addressDetails.budget,
                        salary: addressDetails.salary,
                        products: cart.getCart(),
                        total: cart.cartTotal()
                    })
                })
                
                if (response.status == 200) {
                    toast.success('Order Complete!', { autoClose: 3000 })
                    cart.clearCart()
                    return router.push('/success')
                }
            } catch (error) {
                console.log(error)
                toast.error('Something went wrong?', { autoClose: 3000 })
            }

            useIsLoading(false)
        }
    }

    const showError = (errorMsgText) => {
        let errorMsg = document.querySelector("#card-error");
        toast.error(errorMsgText, { autoClose: 3000 })
        errorMsg.textContent = errorMsgText;
        setTimeout(() => { errorMsg.textContent = "" }, 3000);
    };

  return (
    <>
        <MainLayout>
            <div id="CheckoutPage" className="mt-4 max-w-[1100px] mx-auto">

                <div className="text-2xl text-white font-bold mt-4 mb-4">Checkout</div>
    
                <div className="relative flex items-baseline gap-4 justify-between mx-auto w-full">
                    <div className="w-[65%]">
                        <div className="bg-custom-color rounded-lg p-4 border">

<<<<<<< HEAD
                            <div className="text-xl font-semibold text-white mb-2">Shipping Address</div>
=======
                            <div className="text-xl font-semibold mb-2">Report</div>
>>>>>>> 7e2e2b309db4689042afdc55891ee9dbfd2940f9

                            <div>

                                {!isLoadingAddress && addressDetails.name ?
                                    <ul className="text-sm text-white mt-2">
                                        <li>Name: {addressDetails.name}</li>
                                        <li>Address: {addressDetails.address}</li>
                                        <li>Zip: {addressDetails.zipcode}</li>
                                        <li>City: {addressDetails.city}</li>
                                        <li>Country: {addressDetails.country}</li>
                                        <li>Budget: {addressDetails.budget}</li>
                                        <li>Salary: {addressDetails.salary}</li>
                                    </ul>
                                : null}
                                {!isLoadingAddress ?
                                    <button>
                                        <Link href="/address" className="text-white text-sm underline">
                                            {addressDetails.name ? 'Update Address' : 'Add Address'}

                                        </Link>
                                    </button>    
                                : null}

                                {isLoadingAddress ?
                                    <div className="flex items-center mt-1 gap-2">
                                        <AiOutlineLoading3Quarters className="animate-spin"/>
                                        Getting Address...
                                    </div>
                                : <div></div>}
                            </div>
                        </div>

                        <ClientOnly>
                            <div id="Items" className="bg-custom-color rounded-lg text-white mt-4">
                                {cart.getCart().map(product => (
                                    <CheckoutItem key={product.id} product={product} />
                                ))}
                            </div>
                        </ClientOnly>
                    </div>
                    
                    <div id="PlaceOrder" className="relative -top-[6px] w-[35%] border rounded-lg">
                        <ClientOnly>
                            <div className="p-4">
                                <div className="flex items-baseline justify-between text-sm text-white mb-1">
                                    <div>Items ({cart.getCart().length})</div>
                                    <div>${(cart.cartTotal() / 100).toFixed(2)}</div>
                                </div>
                                <div className="flex items-center justify-between mb-4 text-sm text-white">
                                    <div>Shipping:</div>
                                    <div>Free</div>
                                </div>

                                <div className="border-t" />

                                <div className="flex items-center justify-between my-4">
<<<<<<< HEAD
                                    <div className="font-semibold text-white">Order total</div>
                                    <div className="text-2xl font-semibold text-white">
=======
                                    <div className="font-semibold">Order total</div>
                                    <div className="text-2xl font-semibold">
>>>>>>> 7e2e2b309db4689042afdc55891ee9dbfd2940f9
                                        ${(cart.cartTotal() / 100).toFixed(2)}
                                    </div>
                                </div>

                                <form onSubmit={pay}>
                                    <div 
                                        className="border border-white p-2 rounded-sm text-sm text-white" 
                                        id="card-element" 
                                    />

                                    <p 
                                        id="card-error" 
                                        role="alert" 
                                        className="text-red-700 text-center font-semibold relative top-2" 
                                    />

                                    <button 
                                        type="submit"
                                        className="mt-4 bg-white text-lg w-full text-back-color font-semibold p-3 rounded-full"
                                    >
                                        <div>Confirm and pay</div>
                                    </button>
                                </form>
                            </div>
                        </ClientOnly>

                        <div className="flex items-center p-4 justify-center gap-2 border-t">
                            <img width={50} src="/images/Logo2.png" />
                            <div className=" font-light text-white mb-2 mt-2">MONEY BACK GUARANTEE</div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    </>
  )
}
