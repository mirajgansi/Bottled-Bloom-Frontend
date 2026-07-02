'use client';
import Image from 'next/image'
import Link from 'next/link';

const OnBoarding = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6  ">
        <div>
             <Image
      src="/8140 1.jpg"
      width={200}
      height={350}
      alt="Product Image"
      className='border rounded-full'
    />
        </div>

      <div className="text-3xl text-black font-extrabold text-center">
        Welcome <br /> to  our store
      </div>
      <Link className="text-xl bg-[#4CAF50] text-white border-0 rounded-2xl px-10 py-2" href={'\login'}>
        Get Started
      </Link>
    </div>
  );
};

export default OnBoarding;
