import Home from "../Svg/Home"

const Header = ({

}) => {

    return <>
        <div className="flex justify-between items-center max-w-6xl mx-auto px-2 py-6 bg-custom-color1 shadow-2xl">
            <div>
                <h2 className="text-3xl">بالسا</h2>
                <h3 className="text-sm text-custom-color2">کافه رستوران</h3>
            </div>

            <div className="w-12 bg-custom-color2 p-1 rounded-2xl">
                <Home />
            </div>
        </div>
    </>
}

export default Header