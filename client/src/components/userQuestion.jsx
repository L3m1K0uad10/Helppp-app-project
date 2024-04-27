function UserQuestion(props) {
    //****ADDED: handleClick
    const handleClick = () => {
        console.log(props.id);
        props.onSelectQuestion(props.id);
    }

    const formattedDate = new Date(props.date).toLocaleDateString("en-US");
    
    return(
        <a className = {`user-question-card ${props.isSelected ? "userselectedquestion" : ""}`} 
            onClick = {handleClick}>
            <p className = "user-question-card-content">{props.content}</p>
            <p className = "user-question-card-date">{formattedDate}</p>
        </a>
    )
}

export default UserQuestion;
