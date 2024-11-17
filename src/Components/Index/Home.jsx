import { Link } from "react-router-dom"

const Home = ({

}) => {

    return <>
        <div className="flex flex-col justify-center items-center h-screen gap-8">
            <h1 className="text-4xl font-bold">... سایت درحال طراحی و توسعه میباشد ...</h1>
            <h2 className="text-xl font-bold border-b border-red-500 rounded-b-lg px-4 py-1">لطفا شکیبا باشید</h2>
            <Link to="/menu"  className="bg-custom-color2 px-8 py-2 rounded">منو</Link>
        </div>
    </>
}

export default Home