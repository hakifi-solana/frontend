import Button from '@/components/common/Button';
import { Calendar } from '@/components/common/Calendar/Base';
import React from 'react';
import { DateRange } from 'react-day-picker';

type CalendarDrawerProps = {
    onChange: (range: DateRange) => void;
    title: string
    range?: DateRange;
};

const CalendarDrawer = ({ range, onChange, title }: CalendarDrawerProps) => {
    const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(range);

    const handleOnChangeDate = (e: React.MouseEvent<HTMLButtonElement>) => {
        onChange(selectedDate as DateRange);
    };

    return (
        <>
            <p className="my-4 text-title-20 text-center">
                {title}
            </p>

            <Calendar
                initialFocus
                mode="range"
                defaultMonth={selectedDate?.from}
                selected={selectedDate}
                onSelect={(date) => setSelectedDate(date as DateRange)}
                numberOfMonths={1}
                footer={
                    <Button size="lg" variant="primary" className="justify-center w-full" onClick={handleOnChangeDate}>
                        Confirm
                    </Button>
                }
            />
        </>
    );
};

export default CalendarDrawer;