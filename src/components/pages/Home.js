import styles from './Home.module.css'
import savings from '../../img/savings.svg'
import LinkButton from '../layout/LinkButton'

function Home() {
    return (
        <section className={styles.homeContainer}>
            <h1>Welcome to <span>Costs</span></h1>
            <p>Start manage your projects</p>
            <LinkButton to="/newProject" text="Create Project" />
            <img src={savings} alt="Costs" />
        </section>
        )
}

export default Home