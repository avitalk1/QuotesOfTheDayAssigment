import axios from 'axios';
import { useEffect, useRef, useState } from "react";

import { SERVER_URL } from '../config';

const MAX_RETRIES = 10;

const useGetTags = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState(null);
    const [retryCounter, setRetryCounter] = useState(0);
    const [hasError, setHasError] = useState(false);
    const fetchIntervalRef = useRef(null);

    const fetchTags = async () => {
        setIsLoading(true);
        try {
            const results = await axios.get(`${SERVER_URL}/tags`);
            setTags(results.data);
            clearInterval(fetchIntervalRef.current);
            fetchIntervalRef.current = null;
            setHasError(false)
        } catch (error) {
            setHasError(true)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (retryCounter > 0 && retryCounter < MAX_RETRIES && !fetchIntervalRef.current) {
            fetchIntervalRef.current = setInterval(() => {
                fetchTags();
            }, 10000);
        }
        if (retryCounter > MAX_RETRIES) {
            clearInterval(fetchIntervalRef.current);
            fetchIntervalRef.current = null;
        }
    }, [retryCounter]);

    useEffect(() => {
        if (retryCounter < MAX_RETRIES && !tags && hasError) {
            setRetryCounter(prev => prev + 1);
        }
    }, [tags, isLoading, hasError]);

    useEffect(() => {
        if (retryCounter === 0) fetchTags();
        return () => {
            if (fetchIntervalRef.current) {
                clearInterval(fetchIntervalRef.current);
                fetchIntervalRef.current = null;
            }
        };
    }, []);

    return {
        isLoading,
        tags
    }
}

export default useGetTags;