import styles from './ProjectForm.module.css';
import Input from '../form/Input';
import Select from '../form/Select';
import SubmitBtn from '../form/SubmitBtn';

import {useEffect, useState} from 'react'

function ProjectForm({handleSubmit, btnText, projectData}) {

    const [categories, setCategories] = useState([]);
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch("http://localhost:5000/categories", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
        .then((data) => { setCategories(data) } )
        .catch((err) => console.log(err))
    }, []);

    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project);
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value })
    }

    function handleCategory(e) {
        setProject({ ...project, category : {
            id : e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
        } })
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input handleOnChange={handleChange} name="name" type="text" text="Project Name" placeholder="Insert project name" value={project.name ? project.name : ''}/>
            <Input handleOnChange={handleChange} name="budget" type="number" text="Total Budget $" placeholder="Insert total budget" value={project.budget ? project.budget : ''}/>
            <Select handleOnChange={handleCategory} name="category_id" text="Select a category" options={categories} value={project.category ? project.category.id : ''}/>
            <SubmitBtn text={btnText} />
        </form>
    )
}

export default ProjectForm