import React, { useState} from 'react';
import ClayDatePicker from '@clayui/date-picker';
import ClayButton from '@clayui/button';

import getAppContext, { ContextProps } from '../Context';
import { DateFilterProps, DateFormat } from './definitions'
import { prettifyDateValue } from '../utils';

interface IProps extends DateFilterProps {
    panelType?: 'add' | 'edit'
}

const getDateObj = (date: Date) => {
    debugger;
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate()
    }
}

const DateFilter: React.FunctionComponent<IProps> = (props: IProps) => {
    const { actions } : ContextProps = getAppContext();

    const [ value, setValue ] = useState(props.value);
    const [ valid, setValid ] = useState(true);
    const [ inputValue, setInputValue ] = useState(prettifyDateValue(props.value));

    function updateDate(selectedValue: string | Date) {
        const newDate: Date = typeof selectedValue === 'string' 
            ? new Date(selectedValue) 
            : selectedValue;
        
        const newDateValid = !(newDate.toLocaleString() === 'Invalid Date')

        setValid(newDateValid);

        const newValue = newDateValid ? getDateObj(newDate) : undefined

        setInputValue(
            typeof selectedValue === 'string'
                ? selectedValue
                : prettifyDateValue(newDate)
        )

        setValue(newValue)

        console.log(`newDate: "${newDate}" - selectedValue: "${JSON.stringify(selectedValue)}" - valid: "${valid}" - newValue: "${JSON.stringify(newValue)}"`)
    }

    return (
        <>
            <ClayDatePicker 
                onValueChange={updateDate}
                dateFormat="DD.MM.YYYY"
                placeholder="DD.MM.YYYY"
                value={inputValue}
            />
            <div className="mt-2">
                <ClayButton
                    className="btn-sm"
                    onClick={() => actions.updateFilterValue(props.slug, value)}
                    disabled={
                        (prettifyDateValue(value) === prettifyDateValue(props.value))
                        || !valid
                    }
                >
                    {props.panelType === 'edit' ? 'Edit filter' : 'Add filter'}
                </ClayButton>
            </div>
        </>
    )
}

export default DateFilter;