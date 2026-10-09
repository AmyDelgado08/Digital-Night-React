import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios'
function Register() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    //Le pasamos las 4 variables que guardan lo que el usuario escribió.
    const registerUser = async () => {
        // Evita que la página se recargue al enviar el formulario

        const response = await axios.post('http://localhost:3000/users', {
            password,
            email,
            firstName,
            lastName
        })

        //Imprimimos en la consola lo que responde el servidor para control
        // localStorage.setItem('token', response.data.token)
        console.log(response.data);


        if (response.status === 200) {
            alert("Salio todo bien")

            //Vaciamos todas las memorias.
            //al ponerlas en "", el formulario vuelve a quedar totalmente en blanco.
            setEmail("")
            setPassword("")
            setFirstName("")
            setLastName("")
        }
    }

    return (
        <>
            <div className="login-background">
            <div className="login-card">
                <h2>Crear cuenta</h2>
                
                <input 
                    type="email" 
                    placeholder="Correo electrónico" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                />
                
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)} 
                />
                
                <input 
                    type="text" 
                    placeholder="Nombre" 
                    value={firstName} 
                    onChange={(event) => setFirstName(event.target.value)} 
                />
                
                <input 
                    type="text" 
                    placeholder="Apellido" 
                    value={lastName} 
                    onChange={(event) => setLastName(event.target.value)} 
                />
                
                <Button variant='contained' onClick={registerUser}>
                    Registrarse
                </Button>
            </div>
        </div>
        </>
    )
}

export default Register