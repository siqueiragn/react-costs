import {parse, v4 as uuidv4} from 'uuid'

import styles from './Project.module.css'

import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'

import Loading from '../layout/Loading'
import Container from '../layout/Container'
import Message from '../layout/Message'
import ProjectForm from '../project/ProjectForm'
import ServiceForm from '../service/ServiceForm'
import ServiceCard from '../service/ServiceCard'

function Project() {
    const {id} = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
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
            setServices(data.services)
        }).catch((err) => {
            console.log('error')
        })
    }, [id])

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    function editPost(project) {

        // fixing when message not display because content didnt change after same update
        setMessage('')
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

    function createService(project) {
        
        setMessage('')
        const lastService = project.services[project.services.length-1]
        lastService.id = uuidv4() 

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastService.cost)

        // maximum value validation
        if ( newCost > parseFloat(project.budget)) {
            setMessage('Project cost greater than project budget')
            setMessageType('error')
            project.services.pop()
            return false;
        }

        // add service cost to project total cost
        project.cost = newCost

        // update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => { setShowServiceForm(false) })
        .catch(err => console.log(err))
    }   

    function removeService(id, cost) {
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project
        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated) 
            setServices(servicesUpdated)
            setMessage('Service successfully removed!')
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
                    <div className={styles.serviceFormContainer}>
                        <h2>Add a service:</h2>
                        <button className={styles.btn} onClick={toggleServiceForm}>
                            {!showServiceForm ? 'Add Service' : 'Close'}
                        </button>
                        <div className={styles.projectInfo}>
                            {showServiceForm && (
                            <ServiceForm 
                                handleSubmit={createService}
                                btnText="Create Service"
                                projectData={project} />
                            )}
                        </div>
                    </div>
                    <h2>Services</h2>
                    <Container customClass="start">
                        {services.length > 0 && 
                            services.map((service) => (
                            <ServiceCard 
                            id={service.id}
                            name={service.name}
                            cost={service.cost}
                            description={service.description}
                            key={service.id}
                            handleRemove={removeService}
                            />   
                            ))
                        }
                        {services.length === 0 && <p>There isn't services on this project!</p>}
                    </Container>
                </Container>
            </div>
        ) :<Loading />}
    </>)
}

export default Project