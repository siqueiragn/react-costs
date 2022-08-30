import styles from './Project.module.css'

import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'

function Project() {
    const {id} = useParams()

    const [project, setProject] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [message, setMessage] = useState()
    const [messageType, setMessageType] = useState()

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method : "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
        }).catch((err) => {
            console.log('error')
        })
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function editPost(project) {
        //todo budget validation
        if ( project.budget < project.cost ) {
            setMessage("The project budget can't be lower than the project cost!")
            setMessageType("error")
            return false
        }  

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage("Project updated successfully!")
            setMessageType("success")
        })
        .catch((err) => console.log(err))
    }

    return (<>
        {project.name ? (
            <div className={styles.projectDetails}>
                <Container customClass="column">
                    {message && <Message type={messageType} msg={message} />}
                    <div className={styles.detailsContainer}>
                        <h1>Project: {project.name}</h1>
                        <button className={styles.btn} onClick={toggleProjectForm}>
                            {!showProjectForm ? 'Edit Project' : 'Close'}
                        </button>
                        {!showProjectForm ? (
                            <div className={styles.projectInfo}>
                                <p>
                                    <span>Category: </span> {project.category.name}
                                </p>
                                <p>
                                    <span>Project Budget: </span> {project.budget}
                                </p>
                                <p>
                                    <span>Project Cost: </span> {project.cost}
                                </p>
                            </div>
                        ) : (
                            <div className={styles.projectInfo}>
                                <ProjectForm
                                 handleSubmit={editPost}
                                 btnText="Update project"
                                 projectData={project} />
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        ) :<Loading />}
    </>)
}

export default Project