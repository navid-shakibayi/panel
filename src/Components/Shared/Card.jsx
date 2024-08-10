const Card = ({
    name,
    src,
    alt,
    description,
    price,
    instock,
    isnew,
}) => {

    return <>
        <div className="relative bg-custom-color12 w-full rounded-md flex gap-2 p-2 shadow shadow-custom-color12">
            <img
                src={src}
                alt={alt}
                className="w-24 h-24 rounded"
            />
            <div className="flex flex-col justify-between">
                <div>
                    <p className="text-base mt-1 font-kalame">{name}</p>
                    <p className="text-custom-color21 text-[10px] leading-tight mt-2">{description}</p>
                </div>

                <div className="flex gap-2">
                    <p className="underline decoration-custom-color3 decoration-[3px] underline-offset-4">{price}</p>

                    {isnew && (
                        <div className="flex items-center gap-2 ms-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-600"></span>
                            </span>
                            <span className="text-xs text-yellow-600 font-bold">جدید</span>
                        </div>
                    )}
                </div>
            </div>
            {instock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-md backdrop-blur-[1px]">
                    <span className="text-lg font-bold drop-shadow-xl bg-yellow-600 bg-opacity-50 w-full text-center">تمام شد</span>
                </div>
            )}
        </div>
    </>
}

export default Card
