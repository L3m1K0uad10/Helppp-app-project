import react, {useState} from "react"

function OtherUserQuestion(props) {
    //****ADDED: handleClick
    const handleClick = () => {
        console.log(props.id);
        props.onSelectQuestion(props.id);
    }

    const formattedDate = new Date(props.date).toLocaleDateString("en-US");
    
    return(
        <a 
            className={`question-card ${props.isSelected ? "otherselectedquestion" : ""}`} 
            onClick={handleClick}>
                <p className = "question-card-content">{props.content}</p>
                <p className = "question-card-date">{formattedDate}</p>
                <address className = "question-card-author">from {props.author}</address>
        </a>
    )
}

export default OtherUserQuestion;
