import React, {useState, useEffect} from "react";
import io from 'socket.io-client';
import TextField from '@material-ui/core/TextField'
import './App.css';

const socket = io.connect('http://localhost:4000')

function App() {

    const [state, setState] = useState({
        message: '',
        name: ''
    })
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.on("message", ({name, message}) => {
            setChat([...chat, {name, message}])
        })
    }, [state])

    const onTextChange = (e) => {
        const {name, value} = e.target;

        setState((oldData) => {
            return {
                ...oldData,
                [name]:value
            }
        })
    }

    const onMessageSubmit = (e) => {
        e.preventDefault();

        const {name, message} = state;
        socket.emit('message', [name, message]);

        setState({message: "", name})
    }

    const renderChat = () => {
        return chat.map(({name, message}, index) => (
            <div key={index}>
                <h3>{name}: <span>{message}</span></h3>
            </div>
        ))
    }

    return (
        <div className="card">
            <form onSubmit={onMessageSubmit}>
                <h1>Messanger</h1>
                <div className="name-field">
                    <TextField
                        name="name"
                        value={state.name}
                        onChange={e => onTextChange(e)}
                        label="Name"
                    />
                </div>

                <div>
                    <TextField
                        name="message"
                        value={state.message}
                        onChange={e => onTextChange(e)}
                        id="outline-multiline-static"
                        variant='outlined'
                        label="Message"
                    />
                </div>
                <button>Send Message</button>
            </form>
            <div className="render-chat">
                <h1>Chat log</h1>
                {renderChat()}
            </div>
        </div>
    );
}

export default App;
