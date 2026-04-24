import React from 'react';

const SuccessModal = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-['Poppins']">
            {/* Start of Figma Code */}
            <div className="w-[460px] h-80 px-12 py-12 bg-white rounded-[20px] inline-flex justify-center items-start gap-2.5 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="w-48 h-60 inline-flex flex-col justify-start items-center gap-6">
                    {/* Icon Section */}
                    <div className="w-24 h-24 p-1.5 bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 rounded-[48px] outline outline-1 outline-offset-[-1px] outline-emerald-500 inline-flex justify-start items-start gap-2.5">
                        <div className="w-20 h-20 relative flex items-center justify-center">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                                <svg 
                                    width="32" 
                                    height="24" 
                                    viewBox="0 0 32 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M3 12L11.5 20.5L29 3" 
                                        stroke="white" 
                                        strokeWidth="5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
                        <div className="self-stretch flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch h-8 text-center justify-start text-slate-950 text-2xl font-semibold font-['Poppins'] tracking-tight">
                                Login Berhasil!
                            </div>
                            <div className="self-stretch h-6 text-center justify-start text-zinc-600 text-base font-normal font-['Poppins'] tracking-tight">
                                Selamat datang kembali!
                            </div>
                        </div>

                        {/* User Pill Section */}
                        <div className="w-20 h-8 p-2.5 bg-sky-600/10 rounded-[100px] outline outline-1 outline-offset-[-1px] outline-sky-600/20 inline-flex justify-center items-center gap-2.5">
                            <div className="w-3.5 h-3.5 relative flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 7C8.933 7 10.5 5.433 10.5 3.5C10.5 1.567 8.933 0 7 0C5.067 0 3.5 1.567 3.5 3.5C3.5 5.433 5.067 7 7 7ZM7 8.16667C4.66667 8.16667 0 9.33333 0 11.6667V14H14V11.6667C14 9.33333 9.33333 8.16667 7 8.16667Z" fill="#0284C7"/>
                                </svg>
                            </div>
                            <div className="text-center justify-start text-sky-600 text-xs font-medium font-['Poppins'] tracking-tight">User</div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Figma Code */}
        </div>
    );
};

export default SuccessModal;


