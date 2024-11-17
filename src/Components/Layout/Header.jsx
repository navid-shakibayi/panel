import { useEffect, useState } from "react"
import Home from "../Svg/Home"
import axios from "axios"
import { Link } from "react-router-dom"

const Header = ({

}) => {

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:1337/api/branding/')
            .then((response) => {
                setData(response.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return <>
        {data && <>
            <div className="flex justify-between items-center max-w-6xl mx-auto px-2 py-6 bg-custom-color1 shadow-2xl">
                <Link to='/'>
                    <h2 className="text-3xl font-medium">{data.attributes.businessName}</h2>
                    <h3 className="text-sm text-custom-color2">{data.attributes.businessSubtitle}</h3>
                </Link>

                <Link to='/' className="w-12 bg-custom-color2 p-1 rounded-2xl">
                    <Home />
                </Link>
            </div>
        </>}
    </>
}

export default Header