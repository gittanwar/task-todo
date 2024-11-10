import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSun, faMoon, } from '@fortawesome/free-solid-svg-icons';
import "./App.css";
import MyImage from './images/todo.webp';

const App = () => {
    const [userInput, setUserInput] = useState("");
    const [todoDate, setTodoDate] = useState(""); // State for date
    const [todoReminder, setTodoReminder] = useState(""); // State for reminder time
    const [list, setList] = useState(JSON.parse(localStorage.getItem("todoList")) || []);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [loading, setLoading] = useState(true);

    // Preloader effect
    useEffect(() => {
        const loadTimeout = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(loadTimeout);
    }, []);

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            checkReminders(); // Check reminders every second
        }, 1000);

        return () => clearInterval(timeInterval);
    }, []);

    const updateInput = (value) => {
        setUserInput(value);
    };

    const addItem = () => {
        if (!userInput) {
            alert("Please enter a task.");
            return;
        }
        
        if (!todoDate || !todoReminder) {
            alert("Please select both a date and a reminder time.");
            return;
        }

        const newItem = {
            id: Math.random(),
            value: userInput,
            date: todoDate,
            reminder: `${todoDate}T${todoReminder}`, // Combine date and time for reminders
            completed: false,
        };

        const updatedList = [...list, newItem];
        setList(updatedList);
        localStorage.setItem("todoList", JSON.stringify(updatedList));
        setUserInput("");
        setTodoDate(""); // Reset date
        setTodoReminder(""); // Reset reminder time
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            addItem();
        }
    };

    const deleteItem = (id) => {
        const updatedList = list.filter((item) => item.id !== id);
        setList(updatedList);
        localStorage.setItem("todoList", JSON.stringify(updatedList));
    };

    const editItem = (index) => {
        const editedTodo = prompt("Edit the todo:");
        if (editedTodo !== null && editedTodo.trim() !== "") {
            const updatedTodos = [...list];
            updatedTodos[index].value = editedTodo;
            setList(updatedTodos);
            localStorage.setItem("todoList", JSON.stringify(updatedTodos));
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const handleItemSelect = (id) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(item => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedItems.length === list.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(list.map(item => item.id));
        }
    };

    const bulkDelete = () => {
        const updatedList = list.filter(item => !selectedItems.includes(item.id));
        setList(updatedList);
        setSelectedItems([]);
        localStorage.setItem("todoList", JSON.stringify(updatedList));
    };

    const checkReminders = () => {
        const now = new Date();
        list.forEach(item => {
            const reminderDate = new Date(item.reminder);
            if (item.reminder && reminderDate <= now && !item.completed) {
                alert(`Reminder: ${item.value}`);
            }
        });
    };

    return (
        <Container className={`myapp ${theme === "light" ? "myapp-light" : "myapp-dark"}`}>
            {loading ? (
                <div className="preloader">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <img src={MyImage} alt="Description" />
                    <h3>Code By DK</h3>
                </div>
            ) : (
                <>
                    <Row>
                        <div className="realtime">{currentTime}</div>
                        <h2 className="text-center">TODO LIST</h2>
                        <h4 className="text-center">Ready To Get Started</h4>
                        <Col>
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Enter Task . . . "
                                    size="lg"
                                    value={userInput}
                                    onChange={(e) => updateInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                                <FormControl
                                    type="date"
                                    size="lg"
                                    value={todoDate}
                                    onChange={(e) => setTodoDate(e.target.value)}
                                />
                                <FormControl
                                    type="time"
                                    size="lg"
                                    value={todoReminder}
                                    onChange={(e) => setTodoReminder(e.target.value)}
                                />
                                <Button variant="dark" onClick={addItem}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>

                    {selectedItems.length > 0 && (
                        <Row>
                            <Col>
                                <Button variant="danger" onClick={bulkDelete}>
                                    Delete Selected
                                </Button>
                            </Col>
                        </Row>
                    )}

                    <Row>
                        <Col>
                            <ListGroup>
                                <ListGroup.Item variant="dark" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === list.length}
                                        onChange={handleSelectAll}
                                        style={{ marginRight: "10px" }}
                                    />
                                    Select All
                                </ListGroup.Item>

                                {list.map((item, index) => (
                                    <ListGroup.Item
                                        key={item.id}
                                        variant={item.completed ? "success" : "dark"}
                                        action
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            textDecoration: item.completed ? "line-through" : "none",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleItemSelect(item.id)}
                                                style={{ marginRight: "10px" }}
                                            />
                                            {item.value} - <small>{item.date}</small>
                                        </div>
                                        <span>
                                            <Button className="edit" variant="light" onClick={() => editItem(index)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button className="del" variant="light" onClick={() => deleteItem(item.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>

                    <div className="theme-toggle" style={{ position: "fixed", bottom: "20px", right: "20px" }}>
                        <Button variant="outline-light" onClick={toggleTheme} style={{ borderRadius: "50%", padding: "10px" }}>
                            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default App;
