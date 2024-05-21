import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import eventsData from "./events.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Tooltip = ({ content }) => (
  <div className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm tooltip" style={{ width: "300px" }}>
    {content}
  </div>
);

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Calculating start of the month, days in month, and days in previous month
  const startOfMonth = currentDate.startOf("month").day();
  const daysInMonth = currentDate.daysInMonth();
  const daysInPreviousMonth = currentDate.subtract(1, "month").daysInMonth();

  // Function to generate calendar grid
  const generateCalendarGrid = () => {
    const days = [];
    // Previous month's days
    for (let i = startOfMonth - 1; i >= 0; i--) {
      days.push({
        date: dayjs(currentDate).subtract(1, "month").date(daysInPreviousMonth - i).format("YYYY-MM-DD"),
        currentMonth: false,
        events: getEventsForDate(dayjs(currentDate).subtract(1, "month").date(daysInPreviousMonth - i).format("YYYY-MM-DD")),
      });
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDate = dayjs(currentDate).date(i).format("YYYY-MM-DD");
      days.push({
        date: formattedDate,
        currentMonth: true,
        events: getEventsForDate(formattedDate),
      });
    }
    // Next month's days
    for (let i = 1; days.length % 7 !== 0; i++) {
      days.push({
        date: dayjs(currentDate).add(1, "month").date(i).format("YYYY-MM-DD"),
        currentMonth: false,
        events: getEventsForDate(dayjs(currentDate).add(1, "month").date(i).format("YYYY-MM-DD")),
      });
    }
    return days;
  };

  // Function to get events for a specific date
  const getEventsForDate = (date) => {
    return eventsData.filter((event) => event.date === date);
  };

  // Function to change month
  const changeMonth = (direction) => {
    setCurrentDate(currentDate.add(direction, "month"));
  };

  // Event handlers for date hover and click
  const handleDateHover = (date) => {
    setHoveredDate(date);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Today's date
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div className="max-w-4xl mx-auto mt-5 p-8 bg-white rounded-xl shadow-xl relative">
      <div className="flex justify-between items-center mb-6">
        <button className="p-3 bg-gray-300 hover:bg-gray-400 rounded-full transition" onClick={() => changeMonth(-1)}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800">{currentDate.format("MMMM YYYY")}</h2>
        <button className="p-3 bg-gray-300 hover:bg-gray-400 rounded-full transition" onClick={() => changeMonth(1)}>
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4 text-base">
  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
    <div key={day} className="text-center font-semibold text-gray-600">{day}</div>
  ))}
  {generateCalendarGrid().map((day, index) => {
    const isToday = day.date === today;
    const isSelected = day.date === selectedDate;
    const hasEvents = day.events.length > 0;
    const firstEventTitle = hasEvents ? day.events[0].title : "";

    const overlappingEvents =
      hasEvents &&
      day.events.length > 1 &&
      day.events.some((event, i) =>
        day.events.some(
          (otherEvent, j) =>
            i !== j &&
            event.time === otherEvent.time &&
            event.date === otherEvent.date
        )
      );

    return (
      <div
        key={index}
        className={`relative p-3 rounded-lg cursor-pointer transition border-2 duration-200 ${day.currentMonth ? "text-gray-800" : "text-gray-400"} ${isSelected ? "border-solid border-2 border-green-500 text-black" : ""} ${!isToday && !isSelected ? "hover:bg-gray-200" : ""} ${
          day.date === today ? "bg-green-400" : ""
        } sm:w-1/8 md:w-1/8 lg:w-1/8 xl:w-1/8`}
        onClick={() => handleDateClick(day.date)}
        onMouseEnter={() => handleDateHover(day.date)}
        onMouseLeave={() => handleDateHover(null)}
      >
        <div className="mb-1 text-lg">
          {isToday ? (
            dayjs(day.date).date()
          ) : (
            dayjs(day.date).date()
          )}
        </div>
        {overlappingEvents && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs rounded-sm">
            {day.events.length} conflicts
          </div>
        )}
        {hasEvents && hoveredDate === day.date && (
          <Tooltip
            content={day.events.map((event, index) => (
              <div key={index}>
                <p className="text-yellow-500">
                  <strong>{event.title}</strong>
                </p>
                <p>
                  {event.date} | {event.time} | {event.duration}
                </p>
              </div>
            ))}
          />
        )}
        {hasEvents && (
          <div
            className="absolute top-10 left-0 right-0 bottom-0 bg-black opacity-80 text-white rounded-lg flex justify-center items-center"
            style={{ backgroundColor: day.events[0].color }}
          >
            <div className="text-xs text-white font-bold">
              {firstEventTitle}
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>

    </div>
  );
};

export default Calendar;
