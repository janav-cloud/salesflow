import React from 'react'
import Image from 'next/image'
import { LucideInstagram, Linkedin, MailIcon } from 'lucide-react'

function Footer() {
  return (
    <div className='cursor-pointer p-10 flex flex-row justify-between items-center bg-slate-950'>
        <div className="ml-5 flex">
            <Image 
                src="/assets/SF-white.svg"
                width={40}
                height={40}
                alt='SalesFlow'
            />
        </div>
        <div className='text-sm mr-5 flex flex-col md:flex-row gap-10 md:text-md'>
            <div>
                <div className='bg-gray-700 h-[100%] w-0.5'></div>
            </div>
            <ul className='grid grid-cols-1 gap-2 mr-10 text-slate-100'>
                <li>About Us</li>
                <li>Features</li>
                <li>FAQ</li>
                <li className='text-slate-500'>SalesFlow ®</li>
            </ul>
            <div>
                <div className='bg-gray-700 h-[100%] w-0.5'></div>
            </div>
            <ul className='grid grid-cols-1 gap-2 text-slate-500'>
                <li className='text-slate-100'>Contact Us</li>
                <li className='flex flex-row items-center gap-3'>
                    <LucideInstagram size={15}></LucideInstagram>
                    <span>Instagram</span>
                </li>
                <li className='flex flex-row items-center gap-3'>
                    <Linkedin size={15}></Linkedin>
                    <span>LinkedIn</span>
                </li>
                <li className='flex flex-row items-center gap-3'>
                    <MailIcon size={15}></MailIcon>
                    <span>Mail Us</span>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Footer