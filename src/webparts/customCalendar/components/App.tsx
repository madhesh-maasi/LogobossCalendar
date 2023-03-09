import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./CustomCalendar.module.scss";
import CalendarView from "./CalendarView";
let timeZone = "India Standard Time"; //for local time zone
let headers = { Prefer: 'outlook.timezone="' + timeZone + '"' };
let data = [];
const App = (props) => {
  const [events, setEvents] = useState([]);
  const getGroupEvents = () => {
    // 5f5263bc-2144-4b8b-9eb0-2d225dfc6de1
    props.graphcontext.groups
      .getById("5f5263bc-2144-4b8b-9eb0-2d225dfc6de1")
      .events.configure({ headers })
      .top(999)()
      .then((result: any) => {
        console.log(result);
        // let data1 = [];
        let recEndDateTime;
        let recEDate;
        data = result.map((evt) => {
          let recED = "";
          let eventColor = "";
          let eventType = "";
          // let eventColorArr = [].filter((colLi) => {
          //   return evt.subject
          //     .toLowerCase()
          //     .includes(colLi.Title.toLowerCase());
          // });
          // eventColorArr.length > 0
          //   ? ((eventColor = eventColorArr[0].HexCode),
          //     (eventType = "GroupCalendar"))
          //   : ((eventColor = [].filter(
          //       (colLi) => colLi.DefaultEventColor == true
          //     )[0].HexCode),
          //     (eventType = "GroupCalendar Other"));

          let dow = [];
          evt.recurrence &&
          evt.recurrence.pattern.type == "weekly" &&
          evt.recurrence.pattern.daysOfWeek.length > 0
            ? evt.recurrence.pattern.daysOfWeek.forEach((dw) => {
                dw == "monday"
                  ? dow.push(1)
                  : dw == "tuesday"
                  ? dow.push(2)
                  : dw == "wednesday"
                  ? dow.push(3)
                  : dw == "thursday"
                  ? dow.push(4)
                  : dw == "friday"
                  ? dow.push(5)
                  : dw == "saturday"
                  ? dow.push(6)
                  : dw == "sunday"
                  ? dow.push(7)
                  : "";
                recEDate = new Date(evt.recurrence.range.endDate);
                recEDate.setDate(recEDate.getDate() + 1);
                recED = recEDate.toISOString().split("T")[0];
                recEDate = new Date(evt.recurrence.range.endDate);
                recEDate.setDate(recEDate.getDate() + 1);
                recED = recEDate.toISOString().split("T")[0];
                recEndDateTime = `${recED}T${evt.end.dateTime.split("T")[1]}`;
              })
            : evt.recurrence && evt.recurrence.pattern.type == "daily"
            ? ((recEDate = new Date(evt.recurrence.range.endDate)),
              (recED = recEDate.toISOString().split("T")[0]),
              (recEndDateTime = `${recED}T${evt.end.dateTime.split("T")[1]}`))
            : "";
          return evt.recurrence && evt.recurrence.pattern.type == "weekly"
            ? {
                id: evt.id,
                title: evt.subject,
                start: evt.start.dateTime,
                end:
                  evt.recurrence.range.type == "noEnd" ||
                  evt.recurrence.range.endDate == "0001-01-01"
                    ? `${
                        new Date(
                          new Date(evt.recurrence.range.startDate).setFullYear(
                            new Date(
                              evt.recurrence.range.startDate
                            ).getFullYear() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0]
                      }T${evt.end.dateTime.split("T")[1]}`
                    : `${evt.recurrence.range.endDate}T${
                        evt.end.dateTime.split("T")[1]
                      }`,
                initialDate: evt.start.dateTime,
                display: "block",
                attendees: evt.attendees,
                description: evt.bodyPreview,
                backgroundColor: "blue",
                borderColor: "blue",
                allDay: evt.isAllDay,
                itemFrom: eventType,
                rrule: {
                  freq: "weekly",
                  interval: evt.recurrence.pattern.interval,
                  byweekday: dow.map((dw) =>
                    dw == 1
                      ? "mo"
                      : dw == 2
                      ? "tu"
                      : dw == 3
                      ? "we"
                      : dw == 4
                      ? "th"
                      : dw == 5
                      ? "fr"
                      : dw == 6
                      ? "sa"
                      : "su"
                  ),
                  dtstart: `${evt.recurrence.range.startDate}T${
                    evt.start.dateTime.split("T")[1]
                  }`, // will also accept '20120201T103000'
                  until:
                    evt.recurrence.range.type == "noEnd" ||
                    evt.recurrence.range.endDate == "0001-01-01"
                      ? `${
                          new Date(
                            new Date(
                              evt.recurrence.range.startDate
                            ).setFullYear(
                              new Date(
                                evt.recurrence.range.startDate
                              ).getFullYear() + 1
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        }T${evt.end.dateTime.split("T")[1]}`
                      : evt.recurrence.range.endDate, // will also accept '20120201'
                },
              }
            : evt.recurrence && evt.recurrence.pattern.type == "daily"
            ? {
                id: evt.id,
                title: evt.subject,
                start: evt.start.dateTime,
                end:
                  evt.recurrence.range.type == "noEnd" ||
                  evt.recurrence.range.endDate == "0001-01-01"
                    ? `${
                        new Date(
                          new Date(evt.recurrence.range.startDate).setFullYear(
                            new Date(
                              evt.recurrence.range.startDate
                            ).getFullYear() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0]
                      }T${evt.end.dateTime.split("T")[1]}`
                    : `${evt.recurrence.range.endDate}T${
                        evt.end.dateTime.split("T")[1]
                      }`,
                // end: recEndDateTime,
                display: "block",
                attendees: evt.attendees,
                description: evt.bodyPreview,
                backgroundColor: "blue",
                borderColor: "blue",
                allDay: evt.isAllDay,
                itemFrom: eventType,
                rrule: {
                  freq: "daily",
                  interval: evt.recurrence.pattern.interval,
                  byweekday: dow.map((dw) =>
                    dw == 1
                      ? "mo"
                      : dw == 2
                      ? "tu"
                      : dw == 3
                      ? "we"
                      : dw == 4
                      ? "th"
                      : dw == 5
                      ? "fr"
                      : dw == 6
                      ? "sa"
                      : "su"
                  ),
                  dtstart: `${evt.recurrence.range.startDate}T${
                    evt.start.dateTime.split("T")[1]
                  }`, // will also accept '20120201T103000'
                  until:
                    evt.recurrence.range.type == "noEnd" ||
                    evt.recurrence.range.endDate == "0001-01-01"
                      ? `${
                          new Date(
                            new Date(
                              evt.recurrence.range.startDate
                            ).setFullYear(
                              new Date(
                                evt.recurrence.range.startDate
                              ).getFullYear() + 1
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        }T${evt.end.dateTime.split("T")[1]}`
                      : `${evt.recurrence.range.endDate}T${
                          evt.end.dateTime.split("T")[1]
                        }`, // will also accept '20120201'
                },
                //  description: evt.bodyPreview,
              }
            : evt.recurrence && evt.recurrence.pattern.type == "absoluteMonthly"
            ? {
                id: evt.id,
                title: evt.subject,
                // daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
                dayOfMonth: evt.recurrence.pattern.dayOfMonth,

                start: evt.start.dateTime,
                end:
                  evt.recurrence.range.type == "noEnd" ||
                  evt.recurrence.range.endDate == "0001-01-01"
                    ? `${
                        new Date(
                          new Date(evt.recurrence.range.startDate).setFullYear(
                            new Date(
                              evt.recurrence.range.startDate
                            ).getFullYear() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0]
                      }T${evt.end.dateTime.split("T")[1]}`
                    : `${evt.recurrence.range.endDate}T${
                        evt.end.dateTime.split("T")[1]
                      }`,
                // end: evt.end.dateTime,
                display: "block",
                attendees: evt.attendees,
                description: evt.bodyPreview,
                backgroundColor: "blue",
                borderColor: "blue",
                allDay: evt.isAllDay,
                itemFrom: eventType,
                rrule: {
                  freq: "monthly",
                  interval: evt.recurrence.pattern.interval,
                  dtstart: `${evt.recurrence.range.startDate}T${
                    evt.start.dateTime.split("T")[1]
                  }`, // will also accept '20120201T103000'
                  until:
                    evt.recurrence.range.type == "noEnd" ||
                    evt.recurrence.range.endDate == "0001-01-01"
                      ? `${
                          new Date(
                            new Date(
                              evt.recurrence.range.startDate
                            ).setFullYear(
                              new Date(
                                evt.recurrence.range.startDate
                              ).getFullYear() + 1
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        }T${evt.end.dateTime.split("T")[1]}`
                      : evt.recurrence.range.endDate, // will also accept '20120201'
                },
                //  description: evt.bodyPreview,
              }
            : evt.recurrence && evt.recurrence.pattern.type == "relativeMonthly"
            ? {
                id: evt.id,
                title: evt.subject,
                start: evt.start.dateTime,
                end:
                  evt.recurrence.range.type == "noEnd" ||
                  evt.recurrence.range.endDate == "0001-01-01"
                    ? `${
                        new Date(
                          new Date(evt.recurrence.range.startDate).setFullYear(
                            new Date(
                              evt.recurrence.range.startDate
                            ).getFullYear() + 1
                          )
                        )
                          .toISOString()
                          .split("T")[0]
                      }T${evt.end.dateTime.split("T")[1]}`
                    : `${evt.recurrence.range.endDate}T${
                        evt.end.dateTime.split("T")[1]
                      }`, // will also accept '20120201',
                // end: evt.end.dateTime,
                display: "block",
                attendees: evt.attendees,
                description: evt.bodyPreview,
                backgroundColor: "blue",
                borderColor: "blue",
                allDay: evt.isAllDay,
                itemFrom: eventType,
                rrule: {
                  freq: "monthly",
                  interval: evt.recurrence.pattern.interval,
                  // index: evt.recurrence.pattern.index,
                  byweekday: evt.recurrence.pattern.daysOfWeek.map((day) =>
                    day == "monday"
                      ? "mo"
                      : day == "tuesday"
                      ? "tu"
                      : day == "wednesday"
                      ? "we"
                      : day == "thursday"
                      ? "th"
                      : day == "friday"
                      ? "fr"
                      : day == "saturday"
                      ? "sa"
                      : day == "sunday"
                      ? "su"
                      : ""
                  ),
                  bysetpos:
                    evt.recurrence.pattern.index == "first"
                      ? 1
                      : evt.recurrence.pattern.index == "second"
                      ? 2
                      : evt.recurrence.pattern.index == "third"
                      ? 3
                      : evt.recurrence.pattern.index == "fourth"
                      ? 4
                      : -1,
                  dtstart: `${evt.recurrence.range.startDate}T${
                    evt.start.dateTime.split("T")[1]
                  }`, // will also accept '20120201T103000'
                  until:
                    evt.recurrence.range.type == "noEnd" ||
                    evt.recurrence.range.endDate == "0001-01-01"
                      ? `${
                          new Date(
                            new Date(
                              evt.recurrence.range.startDate
                            ).setFullYear(
                              new Date(
                                evt.recurrence.range.startDate
                              ).getFullYear() + 1
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        }T${evt.end.dateTime.split("T")[1]}`
                      : evt.recurrence.range.endDate, // will also accept '20120201'
                },
                //  description: evt.bodyPreview,
              }
            : {
                id: evt.id,
                title: evt.subject,
                start: evt.start.dateTime,
                end: evt.end.dateTime,
                display: "block",
                attendees: evt.attendees,
                description: evt.bodyPreview,
                backgroundColor: "blue",
                borderColor: "blue",
                allDay: evt.isAllDay,
                itemFrom: eventType,
                //  description: evt.bodyPreview,
              };
        });
        console.log(data);
        data = [...data];
        setEvents(data);
      });
  };
  useEffect(() => {
    getGroupEvents();
  }, []);
  return <CalendarView calendarValue={events} />;
};
export default App;
