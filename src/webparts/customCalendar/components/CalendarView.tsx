import * as React from "react";
import { useState, useEffect } from "react";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import "./Bootstrap.js";
import "./Bootstrap.css";
let calendar;
let clickedTarget = "";
const CalendarView = (props) => {
  const [ViewItems, setViewItems] = useState({
    Title: "",
    StartDate: "",
    EndDate: "",
    Attendees: "",
    Description: "",
    AllDay: "",
  });
  if (props.calendarValue.length > 0) {
    BindCalender(props.calendarValue);
  } else {
    BindCalender([
      {
        allDay: false,
        attendees: [],
        backgroundColor: "",
        borderColor: "",
        description: "",
        display: "",
        end: "",
        id: "",
        itemFrom: "",
        start: "",
        title: "",
      },
    ]);
  }
  return (
    <div className="w-100">
      <div className="calendar-section" id="myCalendar"></div>
    </div>
  );
  function BindCalender(Calendardetails) {
    // calendar.refetchEvents();
    // !Calendar Bind
    const dateFormate = new Date("1976-04-19T12:59-0500");
    var calendarEl = document.getElementById("myCalendar");
    calendar = new Calendar(calendarEl, {
      plugins: [
        rrulePlugin,
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth",
      },
      initialDate: new Date(),
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: Calendardetails,

      showNonCurrentDates: false,
      eventDidMount: (event) => {
        event.el.setAttribute("data-id", event.event.id);
        event.el.setAttribute("data-bs-target", "#viewItemModal");
        event.el.setAttribute("data-bs-toggle", "modal");
        event.el.setAttribute("title", event.event.title);
        event.el.classList.add("view-event");
        // ! Show Event Click
        event.el.addEventListener("click", (e) => {
          clickedTarget = e.target["className"];
          let indexID = event.event.id;
          let viewItem = props.calendarValue.filter(
            (li) => li.id == indexID
          )[0];
          // console.log(viewItem);
          let attendees = "";
          if (viewItem.attendees.length > 0) {
            viewItem.attendees.forEach((att) => {
              attendees += `${att.emailAddress.name}; `;
            });
          }
          setViewItems({
            Title: viewItem.title,
            StartDate: new Date(viewItem.start).toLocaleString().toString(),
            EndDate: new Date(viewItem.end).toLocaleString().toString(),
            Attendees: attendees,
            Description: viewItem.description,
            AllDay: viewItem.allDay ? "Yes" : "No",
          });
        });
      },
    });
    // ! Locked Rerender of Calendar

    if (clickedTarget == "" && calendarEl != null) {
      calendar.render();
      calendar.refetchEvents();
    } else {
      clickedTarget = "";
    }

    let dragClass = document.querySelectorAll(".fc-event-draggable");
    dragClass.forEach((dC) => {
      dC.classList.remove("fc-event-draggable");
      dC.classList.add("view-event");
    });
  }
};
export default CalendarView;
