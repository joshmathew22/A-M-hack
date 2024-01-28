"use client"
import Link from "next/link"
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai"
import { BiLoaderCircle } from "react-icons/bi"

export default function MainHeader() {
    function debounce(func, timeout = 300){
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
      }
    const [items, setItems] = useState([])
    const [isSearching, setIsSearching] = useState(null)

    const handleSearchName = debounce (async (event) => {
        if (event.target.value == "") {
            setItems([])
            return
        }

        setIsSearching(true)

        try {
            const response = await fetch(`/api/products/search-by-name/${event.target.value}`)
            const result = await response.json()

            if (result) {
                setItems(result)
                setIsSearching(false)
                return
            }
            setItems([])
            setIsSearching(false)
        } catch (error) {
            console.log(error)
            alert(error)
        }
    }, 250)
    return(
        <>
            <div id="MainHeader" className="border-b">
                <div className="flex items-center justify-between w-full mx-auto max-w-[1200px]">
                    <div className="flex items-center w-full bg-white">
                        <div className="flex items-center flex lg:justify-start justify-between gap-10 max-w-[1150px] w-full px-3 py-5 mx-auto ml-2">
                            <Link href="/">
                                <img width="120" className="rounded-xl" src="/images/Logo2.png/" />
                            </Link>
                            <div className="w-full">
                                <div className="relative">
                                    <div className="flex items-center">
                                        <div className="relative flex items-center border-2 border-gray-900 w-full p-2 rounded-xl">

                                            <button className="flex items-center">
                                                <AiOutlineSearch size={22}/>
                                            </button>

                                            <input 
                                                className="
                                                    w-full
                                                    placeholder-gra-400
                                                    text-sm
                                                    pl-3
                                                    focus:outline-none
                                                "
                                                onChange={handleSearchName}
                                                placeholder="Search for anything"
                                                type="text"
                                            />
                                        </div>
                                            {isSearching ? <BiLoaderCircle className="mr-2 animate-spin" size={22} /> : null}  

                                            {items.length > 0 ?
                                                <div className="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
                                                    {items.map((item) => (
                                                        <div className="p-1" key={item.id}>
                                                            <Link 
                                                                href={`/product/${item?.id}`}
                                                                className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-200 p-1 px-2"
                                                            >
                                                                <div className="flex items-center">
                                                                    <img className="rounded-md" width="40" src={item?.url+'/40'} />
                                                                    <div className="truncate ml-2">{ item?.title }</div>
                                                                </div>
                                                                <div className="truncate">${ (item?.price / 100).toFixed(2) }</div>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            : null} 
                                        <button className="flex items-center bg-custom-color text-sm font-semibold text-white p-[11px] ml-1 px-14 rounded-xl">
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}