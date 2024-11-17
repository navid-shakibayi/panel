const Test = ({

}) => {

    return <>

        <section className="mx-auto flex justify-center">
            <div className="relative overflow-hidden w-full max-w-4xl h-64 bg-gray-600 flex items-center justify-center mt-6 border-4 border-transparent rounded-lg">
                <p className="text-white text-xl">باکس با نقطه درخشان متحرک</p>
                <div className="absolute bottom-0 right-0 w-2 h-4 bg-yellow-400 rounded-full animate-moving-dot"></div>
            </div>
        </section>


        <div class="mx-auto flex w-full  items-center justify-center mt-6">
            <div class="relative flex w-full cursor-pointer items-center overflow-hidden rounded-xl border border-slate-800 p-[2px]">

                <div class="animate-spin-slow absolute h-2 w-full rounded-xl bg-[conic-gradient(#0ea5e9_20deg,transparent_120deg)]"></div>

                dfdf
            </div>
        </div>







        <section className="mx-auto  mt-6">
            <div className="">
                <h2
                    className="relative flex justify-center items-center w-full overflow-hidden text-base text-center font-bold mb-2 rounded-t-[30px] pt-5 pb-3 border-t border-custom-color3 bg-gradient-to-b from-custom-color13 to-custom-color1 before:absolute before:bg-[conic-gradient(#FFCF40_20deg,transparent_120deg)] before:h-2 before:w-full before:animate-spin-slow"
                >
                    <h2 className="absolute bg-gradient-to-b from-custom-color13 to-custom-color1 top-[2px] bottom-[2px] left-[2px] right-[2px] rounded-t-[30px] h-full">
                        نوشیدنی گرم
                    </h2>

                </h2>
            </div>
        </section>




        <section className="flex justify-center items-center h-screen">
            <div className="relative bg-gray-700 w-64 h-64 rounded-xl flex justify-center items-center overflow-hidden before:absolute before:top-[-50%] before:right-[-50%] before:left-[-50%] before:bottom-[-50%] before:bg-[conic-gradient(transparent,transparent,#FCF6BA)] before:animate-spin-slow">
                <div className="absolute bg-gray-500 top-[5px] bottom-[5px] left-[5px] right-[5px] rounded-lg">

                </div>
            </div>
        </section>
    </>
}

export default Test