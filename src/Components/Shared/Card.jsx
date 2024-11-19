const Card = ({
    name,
    src,
    alt,
    description,
    price,
    instock,
    isnew,
}) => {
    return (
        <>
            <div className="relative bg-custom-color12 w-full rounded-2xl flex gap-2 p-2 shadow shadow-custom-color12">
                <span className="absolute top-[5px] right-[5px] bg-custom-color2 w-8 h-8 rounded-tr-xl before:relative after:absolute after:bottom-0 after:left-0 after:w-[31px] after:h-[31px] after:rounded-tr-xl after:bg-custom-color12"></span>
                <div className="relative flex-shrink-0">
                    <img
                        src={src}
                        alt={alt}
                        className="w-24 h-24 rounded-xl"
                    />
                    {isnew && (
                        <span className="absolute bg-custom-color2 px-3 left-1/2 -top-2 transform -translate-x-1/2 rounded-2xl text-xs whitespace-nowrap">آیتم جدید</span>
                    )}
                </div>
                <div className="flex flex-col w-full justify-between">
                    <div>
                        <p className="text-base mt-1 font-kalame">{name}</p>
                        <p className="text-custom-color21 text-[10px] leading-tight mt-2">{description}</p>
                    </div>

                    <div className="flex justify-between gap-2">
                        <p className="underline decoration-custom-color2 decoration-[3px] underline-offset-4">{price}</p>
                        <button className="bg-custom-color2 w-6 h-6 rounded-md font-bold text-lg">+</button>
                    </div>
                </div>
                {instock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-md backdrop-blur-[1px]">
                        <span className="text-lg font-bold drop-shadow-xl bg-yellow-600 bg-opacity-50 w-full text-center">تمام شد</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default Card;
