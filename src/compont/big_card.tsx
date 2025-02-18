import React from 'react'

export const big_card = (title, img, description, ) => {
  return (
    <div className="bg-bg-sec p-4 rounded-md w-full text-bt-main max-w-xs relative">
        <div className='text-2xl'>
            <h3>{title}</h3>
        </div>
        <div className="h-56 bg-bg-main rounded">
            <img src="https://m.media-amazon.com/images/I/81kz06oSUeL._AC_SL1500_.jpg" alt="moive poster" className='h-full m-auto my-1'/>
        </div>
        <div className="py-4">  
            <p className='line-clamp-3'>{description}</p>
            <div className="py-6"></div>
            <button className='bg-bt-main text-white rounded-full px-4 py-2 mt-1 absolute bottom-4 right-4'>
                หาโรง
            </button>
        </div>
    </div>
  )
}
