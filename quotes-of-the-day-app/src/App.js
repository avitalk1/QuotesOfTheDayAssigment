
import axios from 'axios';
import { Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { SERVER_URL } from './config';

import QuotesList from './components/QuotesList';
import NumberOfQuotesInput from './components/NumberOfQuotesInput';

import './App.scss';

function App() {
  const [numberOfQuotesInput, setNumberOfQuotesInput] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [lastFetchePage, setLastFetchedPage] = useState(1);
  const [totalNumberOfPages, setTotalNumberOfPages] = useState();

  const fetchQuotes = async (_page, _numberOfQuotes, type = null, filter = null) => {
    setIsLoading(true);
    try {
      const params = {
        page: _page,
        numOfQuotes: _numberOfQuotes,
        type,
        filter
      }
      const results = await axios.post(`${SERVER_URL}/randomQuotes`, params);
      setQuotes((prev) => [
        ...prev,
        ...results.data.quotes
      ]);

      setTotalNumberOfPages(results.data.totalNumberOfPages);
    } catch (error) {
      console.log('error on fetch quotes')
    } finally {
      setIsLoading(false);
    }
  }

  const handleOnInputSubmit = (numberInput, tagInput) => {
    setQuotes([])
    setLastFetchedPage(1);
    setNumberOfQuotesInput(numberInput);
    setSelectedTag(tagInput);
    fetchQuotes(1, numberInput, 'tag', tagInput);
  }

  const renderLoading = () => {
    return <div>Loading</div>
  }

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  const handleScroll = () => {
    const threshold = Math.max(100, window.innerHeight * 0.1);
    const shouldLoad = lastFetchePage < totalNumberOfPages;
    const bottomOfPage = window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - threshold
    if (bottomOfPage && shouldLoad) {
      setLastFetchedPage(prev => prev + 1);
      fetchQuotes(lastFetchePage + 1, numberOfQuotesInput, 'tag', selectedTag);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastFetchePage, totalNumberOfPages]);


  return (
    <div className="App">
      <NumberOfQuotesInput onSubmit={handleOnInputSubmit}/>
      <QuotesList quotes={quotes} />
      <Fab
        onClick={handleScrollToTop}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}><ArrowUpwardIcon/></Fab>
      {isLoading && renderLoading()}
    </div>
  );
}

export default App;
