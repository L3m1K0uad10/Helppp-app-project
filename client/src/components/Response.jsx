function Response(props) {
    const formattedDate = new Date(props.date).toLocaleDateString("en-US");

    return(
        <div className = "response-card">
            <p className="response-card-content">{props.content}</p>
            <p className="response-card-date">{formattedDate}</p>
            <address className="response-card-author">from {props.author}</address>
        </div>
    )
}

export default Response;