import { useEffect, useState } from "react"
import Home from "../Svg/Home"
import axios from "axios"

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
        <div className="flex justify-between items-center max-w-6xl mx-auto px-2 py-6 bg-custom-color1 shadow-2xl">
            <div>
                <h2 className="text-3xl font-medium">{data.attributes.businessName}</h2>
                <h3 className="text-sm text-custom-color2">{data.attributes.businessSubtitle}</h3>
            </div>

            <div className="w-12 bg-custom-color2 p-1 rounded-2xl">
                <Home />
            </div>
        </div>
    </>
}

export default Header