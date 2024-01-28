"use client"

import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

export default function CarouselComp() {
    return (
        <>
            <div className='max-w-[1200px] mx-auto rounded-xl overflow-hidden'>
                <Carousel classname="rounded-lg" showArrows={true} autoPlay={true} interval={3000} infiniteLoop={true} showThumbs={false} showStatus={false} showIndicators={false}>
                    <div>
                        <img src="/images/banner/image1.png" />
                    </div>
                    <div>
                        <img src="/images/banner/image2.jpeg" />
                    </div>
                    <div>
                        <img src="/images/banner/image3.png" />
                    </div>
                </Carousel>
            </div>     
        
        </>

    )
}