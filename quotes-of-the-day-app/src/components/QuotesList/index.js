import QuoteComponent from "../QuoteComponent";
import './style.scss'

function QuotesList(props) {
    const { quotes } = props;
    const renderQuotesList = () => {
        return (
            <div className="quote-list">
                {
                    quotes?.map(quote => {
                        return <QuoteComponent
                            key={quote.id}
                            title={quote.body}
                            author={quote.author}
                        />
                    })
                }
            </div>
        )
    }


    return (
        <>
            {quotes.length ? renderQuotesList() : <></>}
        </>
    )
}

export default QuotesList;