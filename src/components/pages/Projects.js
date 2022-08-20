import {useLocation} from 'react-router-dom'

import styles from './Projects.module.css'

import Message from '../layout/Message'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
function Projects() {

    const location = useLocation()
    let message = ''
    if ( location.state )
        message = location.state.message

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>My Projects</h1>
                <LinkButton to="/newProject" text="Create project" />
            </div>
            {message && <Message msg={message} type="success"/>}
            <Container customClass="start">
                <p>Projects</p>
            </Container>
        </div>
    )
}

export default Projects