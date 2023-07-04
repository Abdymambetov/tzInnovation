import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import { Tooltip } from '@mui/material';
import { getDataAction } from './redux/slices/calendarSLice';

// const DayNames = {
//   1: 'Пн',
//   3: 'Ср',
//   5: 'Пт'
// }

function Cell({ color, value }) {
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const handleMouseEnter = () => {
    setTooltipOpen(true);
  };
  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };
  let tooltipText = getTooltipText(value);

  return (
  <Tooltip
      open={isTooltipOpen}
      onClose={() => setTooltipOpen(false)}
      onOpen={() => setTooltipOpen(true)}
      title={tooltipText}
      placement="top"
    >
      <div
        className='timeline-cells-cell'
        style={{ backgroundColor: color, position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </Tooltip>
  );
}

function getTooltipText(value) {
  if (value === 0) {
    return 'Нет контрибуций';
  } else if (value < 10) {
    return '1-9 контрибуций';
  } else if (value < 20) {
    return '10-19 контрибуций';
  } else if (value < 30) {
    return '20-29 контрибуций';
  } else {
    return '30+ контрибуций';
  }
}

function Month({ startDate, index }) {
  // let date = moment(startDate).add(index * 7, 'day');
  // let monthName = date.format('MMM');
  let currentDate = moment().subtract(50, 'weeks').add(index * 7, 'days');
  let monthName = currentDate.format('MMM');

  return (
    <div className={`timeline-months-month ${monthName}`}>
      {monthName}
    </div>
  )
}

function WeekDay({ index }) {
  let currentDate = moment().subtract(50, 'weeks').add(index, 'days');
  let dayName = currentDate.format('ddd');

  return (
    <div className='timeline-weekdays-weekday'>
      {/* {DayNames[index]} */}
      {dayName}
    </div>
  )
}

function Timeline({ range, data, colorFunc }) {
  // let days = Math.abs(range[0].diff(range[1], 'days'));
  // let cells = Array.from(new Array(days));
  let cells = Array.from(new Array(357));

  let weekDays = Array.from(new Array(7));

  // let months = Array.from(new Array(Math.floor(days / 7)));
  let months = Array.from(new Array(51));

  let min = Math.min(0, ...data.map(d => d.value));
  let max = Math.max(...data.map(d => d.value));
  let colorMultiplier = 1 / (max - min);

  // let startDate = range[0];
  let startDate = moment().subtract(357, 'days');
  // let startDate = moment();

  return (
    <div className='timeline'>
      <div className="timeline-months">
        {months.map((_, index) => <Month key={index} index={index} startDate={startDate} />)}
      </div>
      <div className="timeline-body">
        <div className="timeline-weekdays">
          {weekDays.map((_, index) => <WeekDay key={index} index={index} startDate={startDate} />)}
        </div>
        <div className="timeline-cells">
          {cells.map((_, index) => {
            let date = moment(startDate).add(index, 'day');
            let dataPoint = data.find(d => moment(date).isSame(d.date, 'day'));
            let value = dataPoint ? dataPoint.value : 0;
            let alpha = colorMultiplier * value;
            let color = colorFunc({ alpha });

            return (
              <Cell
                key={index}
                index={index}
                date={date}
                color={color}
                value={value}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function App() {
  // let startDate = moment().add(-365, 'days');
  let dateRange = [moment().subtract(357, 'days'), moment()];
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getDataAction())
  }, [])
  const {date} = useSelector(state => state.date)
  let apiData = Object.entries(date).map(([date, value]) => {
    return {
      date: moment(date),
      value: value
    };
  });

  return (
    <>
      <Timeline range={dateRange} data={apiData} colorFunc={({ alpha }) => {
        if (alpha === 0) {
          return 'rgba(0, 0, 0, 0)'; 
        } else if (alpha < 10) {
          return `rgba(0, 0, 255, ${alpha})`; 
        } else if (alpha < 20) {
          return `rgba(0, 0, 255, ${alpha})`; 
        } else if (alpha < 30) {
          return `rgba(0, 0, 255, ${alpha})`; 
        } else {
          return `rgba(0, 0, 255, ${alpha})`;
        }
      }}/>
    </>
  )
}

export default App