
import { useState } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField,
    Typography 
} from "@mui/material";

import useGetTags from '../../hooks/useGetTags';

import './style.scss'

function NumberOfQuotesInput(props) {
    const {
        onSubmit
    } = props;

    const {tags, isLoading} = useGetTags();
    const [numberInputError, setNumberInputError] = useState();
    const [numberInput, setNumberInput] = useState();
    const [tagInput, setTagInput] = useState();

    const handleOnInputChange = (e) => {
        const { value } = e.target;
        const valueAsInt = parseInt(value);
        if (isNaN(valueAsInt) || valueAsInt < 0) return;
        setNumberInput(parseInt(value))
    }

    const handleOnSubmit = () => {
        if (tagInput && tags[tagInput].count < numberInput) return setNumberInputError(`${tagInput} has a maximum of ${tags[tagInput].count} quotes`);
        setNumberInputError();
        onSubmit(numberInput, tagInput);
    }

    const handleTagChange = (e) => {
        setTagInput(e.target.value);
    }

    const renderTagsOptions = (
        <div className='input-item'>
            <FormControl fullWidth disabled={isLoading && tags}>
                <InputLabel id="demo-simple-select-label">Tag</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tagInput}
                    label="Tag"
                    onChange={handleTagChange}
                >
                    {
                        tags && Object.values(tags)?.map(tag => {
                            return <MenuItem key={tag.name} value={tag.name}>{tag.name}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </div>
    )

    const renderNumberOfQuotesInput = (
        <div className='input-item'>
            <TextField
                value={numberInput}
                id="outlined-number"
                label="Number of Quotes"
                type="number"
                slotProps={{
                    inputLabel: {
                        shrink: true,
                    },
                    htmlInput: {
                        min: 0,
                    }
                }}
                error={!!numberInputError}
                helperText={numberInputError}
                onChange={handleOnInputChange}
            />
        </div>
    )

    return (
        <div className='inputs-container'>
            <Typography variant='h5' className='input-item'>Quotes of the day</Typography>
            {renderNumberOfQuotesInput}
            {renderTagsOptions}
            <Button className='submit-btn' onClick={handleOnSubmit}>Submit</Button>
        </div>
    )
}

export default NumberOfQuotesInput