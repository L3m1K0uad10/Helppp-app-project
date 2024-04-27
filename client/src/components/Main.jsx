import React from "react";
import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

import {faQuestion, faArrowRight, faUser, faHouse, faComment, faPowerOff} from '@fortawesome/free-solid-svg-icons'
import { faComments } from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import OtherUserQuestion from "./othersQuestions"
import UserQuestion from "./userQuestion"
import Response from "./Response";
import Illustration from "../assets/illustration2.jpg"

import "../styles/homePage.css"



export default function Main() {
    const [questions, setQuestions] = useState([]);
    const [authUserQuestions, setAuthUserQuestions] = useState([]);
    const [description, setDescription] = useState("");

    const [responses, setResponses] = useState([]);
    const [otherSelectedQuestionId, setOtherSelectedQuestionId] = useState(null); //**ADDED
    const [userSelectedQuestionId, setUserSelectedQuestionId] = useState(null); //**ADDED
    const [response_content, setResponseContent] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const userId = getUserIdFromToken(token);
        setUserId(userId);
        getQuestions();
        getUserQuestions(userId);
        //getResponses();
    }, []);

    //QUESTIONS
    const getQuestions = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const userId = getUserIdFromToken(token);
        console.log(`user id : ${userId}`);
        api
            .get("/api/questions/")
            .then((res) => res.data)
            .then((data) => {
                const filteredQuestions = data.filter(question => question.author.id !== userId);
                setQuestions(filteredQuestions);
                //console.log(`unfiltered data`);
                //console.log(data);
                //console.log(`filtered data`);
                //console.log(filteredQuestions);
            })
            .catch((err) => alert(err));
    };

    const getUserQuestions = (userId) => {
        console.log(userId)
        api
            .get(`/api/questions/?user_id=${userId}`)
            .then((res) => res.data)
            .then((data) => {
                setAuthUserQuestions(data);
            })
            .catch((err) => alert(err));
    };
    console.log(authUserQuestions)

    const deleteQuestion = (id) => {
        api
            .delete(`/api/questions/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Question deleted!");
                else alert("Failed to delete Question.");
                getQuestions();
                getUserQuestions();
            })
            .catch((error) => alert(error));
    };
    
    const createQuestion = (e) => {
        e.preventDefault();
        api
            .post("/api/questions/", { description })
            .then((res) => {
                if (res.status === 201) {
                    alert("question posted!");
                    setDescription("")
                }
                else alert("Failed to post question.");
                getQuestions();
                getUserQuestions(userId);
            })
            .catch((err) => alert(err));
    };

    //RESPONSES
    const getResponses = (questionId) => {
        api
            .get(`/api/responses/?question=${questionId}`)
            .then((res) => res.data)
            .then((data) => {
                setResponses(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteResponse = (id) => {
        api
            .delete(`/api/responses/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Response deleted!");
                else alert("Failed to delete Response.");
                //getResponses();
            })
            .catch((error) => alert(error));
    };

    //**ADDED handleOtherSelectedQuestion
    const handleOtherSelectedQuestion = (questionId) => {
        setOtherSelectedQuestionId(questionId);
        setUserSelectedQuestionId(null);
        getResponses(questionId);
    };

    const handleUserSelectedQuestion = (questionId) => {
        setUserSelectedQuestionId(questionId);
        setOtherSelectedQuestionId(null);
        getResponses(questionId);
    }

    //**ADDED handleSubmitResponse
    const handleSubmitResponse = (e) => {
        e.preventDefault();
        if (!otherSelectedQuestionId) {
            alert("Please select a question before posting a response.");
            return;
        }
        createResponse(response_content, otherSelectedQuestionId);
    };

    //**CHANGES 
    const createResponse = (content, questionId) => {
        console.log(`clicked question id: ${questionId}`)
        api
            .post("/api/responses/", { response_content: content, question: questionId })
            .then((res) => {
                if (res.status === 201) {
                    alert("response posted!");
                    setResponseContent(""); //**ADDED 
                }
                else alert("Failed to post response.");
                getResponses(questionId);
            })
            .catch((err) => alert(err));
    };

    // ADDED
    const getUserIdFromToken = (token) => {
        const tokenData = parseJwt(token); // Decode the token to get user information
        return tokenData ? tokenData.user_id : null; // Return user ID
    };

    //ADDED
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const userQuestionElement = authUserQuestions.length === 0 ? (
        <div className="empty-question-icon">
            <FontAwesomeIcon className = "empty-question" icon={faQuestion} />
            <p>No question</p>
        </div>
    ) : (
        authUserQuestions.map(userquestion => (
            <UserQuestion 
                key = {userquestion.id}
                id = {userquestion.id}
                content = {userquestion.description} 
                date = {userquestion.created_at} 
                isSelected = {userSelectedQuestionId === userquestion.id}
                onSelectQuestion = {handleUserSelectedQuestion}
            />
        ))
    );

    const otherQuestionElement = questions.length === 0 ? (
        <div className="empty-question-icon">
            <FontAwesomeIcon className = "empty-question" icon={faQuestion} />
            <p>No question</p>
        </div>
    ) : (
        questions.map(otherquestion => (
            <OtherUserQuestion 
                key = {otherquestion.id}
                id = {otherquestion.id}
                content = {otherquestion.description} 
                date = {otherquestion.created_at} 
                author = {otherquestion.author.username}
                isSelected = {otherSelectedQuestionId === otherquestion.id}
                onSelectQuestion = {handleOtherSelectedQuestion} //**ADDED onSelectQuestion
            />
        ))
    );

    const responseElement = responses.length === 0 ? (
        <div className="empty-response-icon">
            <FontAwesomeIcon className = "empty-response" icon={faComment} />
            <p>No response yet</p>
        </div>
    ) : (
        responses.map(res => (
            <Response 
                key={res.id}
                id={res.id}
                content={res.response_content}
                date={res.created_at}
                author={res.author.username}
            />
        ))
    );

    const [displayType, setDisplayType] = useState("welcome");
    const [activeIconButton, setActiveIconButton] = useState("welcome");

    const handleIconListClick = (type) => {
        setDisplayType(type);
        setActiveIconButton(type);
    };

    console.log("response");
    console.log(responses);

    return (
        <main>
            <div className = "aside-nav-bar">
                <h3 className = "logo-text-home"><span className = "span-logo-text">Help</span>pp!</h3>
                <div className = "aside-nav-icon-middle-container">
                    <a 
                        className = {`icons house ${(activeIconButton === "welcome") ? "active" : ""}`}
                        onClick = {() => handleIconListClick('welcome')}>
                            <FontAwesomeIcon className = "faIcons" icon = {faHouse} style={{ pointerEvents: "none" }}/>
                            <p className = "aside-icon-list-item" style={{ pointerEvents: "none" }}>Welcome</p>
                    </a>
                    <a 
                        className = {`icons question ${(activeIconButton === "userQuestion") ? "active" : ""}`} 
                        onClick = {() => handleIconListClick('userQuestion')}>
                            <FontAwesomeIcon className = "faIcons" icon = {faQuestion}/>
                            <p className = "aside-icon-list-item">Your questions</p>
                    </a>
                    <a 
                        className = {`icons comments ${(activeIconButton === "othersQuestion") ? "active" : ""}`} 
                        onClick = {() => handleIconListClick('othersQuestion')}>
                            <FontAwesomeIcon className = "faIcons" icon = {faComments}/>
                            <p className = "aside-icon-list-item">Their questions</p>
                    </a>
                    <a className = "icons power-off" href="/logout">
                        <FontAwesomeIcon icon = {faPowerOff}/>
                        <p className = "aside-icon-list-item">Log out</p>
                    </a>
                </div>
                <h3 className = "you-have-Q-label">You have a question? Ask here</h3>
                <form onSubmit = {createQuestion} className = "aside-form">
                    <textarea className = "textarea-1" id = "description" name = "description" value = {description} onChange={(e) => setDescription(e.target.value)}/><br/>
                    <button type = "submit" className="aside-form-button">Ask</button>
                </form>
            </div>
            <div className = "main-box-container">

                <div className = "question-display-container right-container">
                    {displayType === 'welcome' && (
                        <div className = "welcome-left-container">
                            <h2 className = "insight-header welcome-insight-header" ><span className = "welcome-colored-label">Welcome</span> to the Web App for Question Posting and Discussion</h2>
                            <p className = "insight">Our platform provides a space for users to post questions on various topics and engage in meaningful discussions with others. Whether you're seeking knowledge, solving problems, or connecting with like-minded individuals, our app is designed to facilitate these interactions.</p>
        
                            <h3 className = "insight-header key-feature-header">Key Features:</h3>
                            <ul className = "unordered-list-1">
                                <li>Post questions on any topic</li>
                                <li>Engage in discussions with other users</li>
                                {/* <li>Follow topics of interest</li> */}
                                <li>Receive notifications for updates</li>
                            </ul>
        
                            <h3 className = "insight-header community-header">Community Guidelines:</h3>
                            <p className = "insight">As a member of our community, we encourage you to:</p>
                            <ul className = "unordered-list-2">
                                <li>Keep discussions constructive and civil</li>
                                <li>Avoid spamming or irrelevant posts</li>
                                <li>Report any inappropriate behavior</li>
                            </ul>
                        </div>
                    )}
                    {displayType === 'userQuestion' && (
                        <div className = "question-display-inner-container">
                            <div className = "question-display-inner-header-container">
                                <h4 className = "question-list-header">Your questions</h4>
                            </div>
                            <div className = "question-display-inner-list-container">
                                {userQuestionElement}
                            </div>
                        </div>
                    )}
                    {displayType === 'othersQuestion' && (
                        <div className = "question-display-inner-container">
                            <div className = "question-display-inner-header-container">
                                <h4 className = "question-list-header">Their questions</h4>
                            </div>
                            <div className = "question-display-inner-list-container">
                                {otherQuestionElement}
                            </div>
                        </div>             
                    )}
                </div>
                <div className = "response-display-container right-container">
                    {displayType === 'welcome' && (
                        <div className = "illustration-container">
                            <img src = {Illustration} alt = "illustration" width = "100%"/>
                        </div>
                    )}
                    {displayType === 'userQuestion' && (
                        <div className = "response-display-container-2">
                            <div className = "response-display-inner-header-container">
                                <h4 className = "response-list-header">Responses</h4>
                            </div>
                            <div className = "response-display-inner-list-container">
                                {((displayType === 'userQuestion' && userSelectedQuestionId) || (displayType === 'othersQuestion' && otherSelectedQuestionId)) && (
                                        responseElement
                                    )
                                }
                            </div>
                            <form className = "response-form" onSubmit={handleSubmitResponse}>
                                <button type = "submit" className = "response-form-button" disabled={!otherSelectedQuestionId}>
                                    <FontAwesomeIcon icon = {faArrowRight} className = "arrow"/>
                                </button>
                                <textarea 
                                    value = {response_content} 
                                    onChange = {(e) => setResponseContent(e.target.value)} 
                                    className = "textarea-2"
                                    placeholder="response to a question here"
                                />
                            </form>
                        </div>
                    )}
                    {displayType === 'othersQuestion' && (
                        <div className = "response-display-container-2">
                            <div className = "response-display-inner-header-container">
                                <h4 className = "response-list-header">Responses</h4>
                            </div>
                            <div className = "response-display-inner-list-container">
                                {((displayType === 'userQuestion' && userSelectedQuestionId) || (displayType === 'othersQuestion' && otherSelectedQuestionId)) && (
                                        responseElement
                                    )
                                }
                            </div>
                            <form className = "response-form" onSubmit={handleSubmitResponse}>
                                <button type = "submit" className = "response-form-button" disabled={!otherSelectedQuestionId}>
                                    <FontAwesomeIcon icon = {faArrowRight} className = "arrow"/>
                                </button>
                                <textarea 
                                    value = {response_content} 
                                    onChange = {(e) => setResponseContent(e.target.value)} 
                                    className = "textarea-2"
                                    placeholder="response to a question here"
                                />
                            </form>
                        </div>             
                    )}
                    {/* <div className = "response-display-inner-header-container">
                        <h4>Responses</h4>
                    </div>
                    <div className = "response-display-inner-list-container">

                    </div>
                    <form className = "response-form">
                        <button className = "response-form-button"><FontAwesomeIcon icon = {faArrowRight} className = "arrow"/></button>
                        <textarea className = "textarea-2"/>
                    </form> */}
                </div>
            </div>
        </main>
    )
};