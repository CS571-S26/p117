import { useCallback, useMemo, useState } from 'react';

type CalendarCell = {
    date: Date;
    currentMonth: boolean;
};

type LocaleWithWeekInfo = Intl.Locale & {
    weekInfo?: {
        firstDay?: number;
    };
};

function detectLocaleFirstDay(locale: string) {
    try {
        const loc = new Intl.Locale(locale) as LocaleWithWeekInfo;

        if (loc.weekInfo?.firstDay !== undefined) {
            const index = loc.weekInfo.firstDay % 7;

            return index;
        }
    } catch {}

    return 0;
}

function useCalendar(date: Date, locale: string) {
    const [startOfMonth, setStartOfMonth] = useState(
        () => new Date(date.getFullYear(), date.getMonth(), 1),
    );

    const goNext = useCallback(() => {
        setStartOfMonth((currentDate) => (
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        ));
    }, []);

    const goPrev = useCallback(() => {
        setStartOfMonth((currentDate) => (
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        ));
    }, []);

    const goToday = useCallback(() => {
        const now = new Date();
        setStartOfMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    }, []);

    const data = useMemo(() => {
        const now = new Date();
        const year = startOfMonth.getFullYear();
        const month = startOfMonth.getMonth();

        const endOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = endOfMonth.getDate();

        const weekDayFormatter = new Intl.DateTimeFormat(locale, {
            weekday: 'short',
        });

        let weekdays = Array.from({ length: 7 }, (_, index) => {
            const base = new Date(2021, 7, index + 1);
            return weekDayFormatter.format(base);
        });

        const startIndex = detectLocaleFirstDay(locale);
        weekdays = weekdays.slice(startIndex).concat(weekdays.slice(0, startIndex));

        const firstDayIndex = startOfMonth.getDay();
        const leading = (firstDayIndex - startIndex + 7) % 7;

        const cells: CalendarCell[] = [];

        for (let index = leading; index > 0; index -= 1) {
            cells.push({
                date: new Date(year, month, 1 - index),
                currentMonth: false,
            });
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            cells.push({
                date: new Date(year, month, day),
                currentMonth: true,
            });
        }

        while (cells.length < 42) {
            const last = cells[cells.length - 1].date;
            const next = new Date(last);
            next.setDate(last.getDate() + 1);
            cells.push({
                date: next,
                currentMonth: false,
            });
        }

        const isToday = (date: Date) => {
            return (
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate()
            );
        };

        return {
            year,
            month,
            weekdays,
            cells,
            isToday,
        };
    }, [locale, startOfMonth]);

    return { ...data, startOfMonth, goNext, goPrev, goToday };
}

export default useCalendar;
