const Test = ({

}) => {

    return <>
        <section className="flex justify-center items-center h-screen">
            <div className="relative bg-gray-700 w-64 h-64 rounded-xl flex justify-center items-center overflow-hidden before:absolute before:top-[-50%] before:right-[-50%] before:left-[-50%] before:bottom-[-50%] before:bg-[conic-gradient(transparent,transparent,#FCF6BA)] before:animate-spin-slow">
                <div className="absolute bg-gray-500 top-[5px] bottom-[5px] left-[5px] right-[5px] rounded-lg">
                    hello
                </div>
            </div>
        </section>
    </>
}

export default Test