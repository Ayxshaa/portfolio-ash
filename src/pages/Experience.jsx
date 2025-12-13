import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import React from 'react'

const Experience = () => {

  // const imgRef = useRef();

  // useGSAP(()=>{
  //   gsap.fromTo(imgRef.current, {x:-100, opacity:0}, {x:0, opacity:1, duration:1.5, ease:"power2.out", scrollTrigger:{
  //     trigger: imgRef.current,
  //     start: "top 80%",
  //     end: "top 50%",
  //   }})
  // })



  return (
    <div className='experience font-[JazzFont]  bg-[radial-gradient(circle_at_bottom,rgba(88,28,135,0.35),transparent_70%)] h-screen  '>
                <h1 className='text-5xl font-light flex justify-center items-center flex-col '>Experience</h1>
        <div className='flex pt-30 gap-20 justify-evenly items-center '>
           <div className="experinceImage h-[40%] w-[40%] flex rounded-2xl ml-24">
          <img classNames="h-[50%] w-[50%] " src="./Bg.png" alt="" />
         </div>
         <div className="experinceText h-[30%] w-[60%] flex flex-col justify-center items-center gap-4">
          <h2 className='text-xl font-bold'>Wavelaps-Frontend Developer</h2>
          <h4>Sep 2025 - Present</h4>
          <p className='w-[50%]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
           <div className="technologies flex items-center justify-evenly gap-10">
            <button className='h-[35px] w-[100px] font-bold bg-[#704995] text-gray-200 rounded-2xl '>JavaScript</button>
            <button className='h-[35px] w-[100px] font-bold bg-[#704995] text-gray-200 rounded-2xl '>React.js</button>
            <button className='h-[35px] w-[100px] font-bold bg-[#704995] text-gray-200 rounded-2xl '>CSS</button>
           </div>
           <div className='flex gap-10 mt-4'>
            <button className='h-[35px] w-[100px] font-bold bg-[#704995] text-gray-200 rounded-2xl'>HTML</button>
            <button className='h-[35px] w-[100px] font-bold bg-[#704995] text-gray-200 rounded-2xl'>GSAP </button>
           </div>
         </div>
        </div>
    </div>
  )
}

export default Experience