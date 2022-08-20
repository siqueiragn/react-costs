import {useNavigate} from 'react-router-dom';
import ProjectForm from '../project/ProjectForm';
import styles from './NewProject.module.css';

function NewProject() {

    const navigate = useNavigate();

    function createPost(project) {
        project.cost = 0;
        project.services = [];

        fetch("http://localhost:5000/projects", {
            method: "POST",
            headers : {
                'Content-type': 'application/json'
            },
            body : JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            //redirect
            navigate('/projects', {state:{message : 'Project created successfully!'}} )
        })
        .catch(err => console.log(err))
    }

    return (
        <div className={styles.newProject_container}>
            <h1>Create Project</h1>
            <p>Create your own project and add a service</p>
            <ProjectForm handleSubmit={createPost} btnText="Create Project" />
        </div>
    )
}

export default NewProject