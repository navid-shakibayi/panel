import CategorySlider from "../Layout/CategorySlider"
import Main from "./Main"

const Home = ({

}) => {

    return <>
        <section className="grid grid-cols-4 gap-2 max-w-6xl mx-auto px-2">

            <CategorySlider />

            <Main />

        </section>
    </>
}

export default Home