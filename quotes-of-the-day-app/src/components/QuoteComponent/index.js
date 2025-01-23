import './style.scss'
function QuoteComponent(props) {
    const {
        title,
        author
    } = props;

    return (
        <div className="card-container">
            <div className="card-content">
                <div className="quote">{title}</div>
                <div className="author">- {author}</div>
            </div>
        </div>
    )
}

export default QuoteComponent;