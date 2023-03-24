import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./CustomCalendar.module.scss";
import CalendarView from "./CalendarView";
let timeZone = "Pacific Standard Time"; //for local time zone
// let timeZone = "India Standard Time"; //for local time zone
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import * as moment from "moment";
let headers = { Prefer: 'outlook.timezone="' + timeZone + '"' };
let data = [];
let listColor = [];
let dropdownvalue = [];
let _arrFilterEvent: any[] = [];
const App = (props) => {
  const [masterEvents, setMasterEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const [render, setRender] = useState(false);
  const [eventItem, setEventItem] = useState({});
  const [todayevents, setTodayevents] = useState([]);
  const getGroupEvents = async () => {
    // 5f5263bc-2144-4b8b-9eb0-2d225dfc6de1

    await props.spcontext.web.lists
      .getByTitle("CalendarConfig")
      .items.get()
      .then((res: any) => {
        console.log(res, "res");
        listColor = res;
        dropdownvalue = [{ key: "Select All", text: "Select All" }];
        res.forEach((col) => {
          if (col.Title != "Default") {
            dropdownvalue.push({
              key: col.Title,
              text: col.Title,
            });
          }

          // console.log(col.Color);
        });

        // console.log(dropdownvalue);
        setColor(listColor);
        // console.log("listcolor", listColor);
        //////////calenderdata

        // Webpart property pane
        props.graphcontext.groups
          // .getById("5f5263bc-2144-4b8b-9eb0-2d225dfc6de1")
          .getById(props.calID)
          .events.configure({ headers })
          .top(999)()
          .then((result: any) => {
            // console.log(result);
            // let data1 = [];
            let recEndDateTime;
            let recEDate;
            data = result.map((evt) => {
              // console.log(evt, "evt");

              let recED = "";
              let eventColor = "";
              let eventType = "";
              let typeOfEvent = "";
              let imageUrl = "";
              let eventColorArr = [];

              if (evt.subject) {
                eventColorArr = listColor.filter((colLi) => {
                  return evt.subject
                    .toLowerCase()
                    .includes(colLi.Title.toLowerCase());
                });
              }

              eventColorArr.length > 0
                ? ((eventColor = eventColorArr[0].Color),
                  (eventType = "GroupCalendar"),
                  (typeOfEvent = eventColorArr[0].Title))
                : ((eventColor = listColor.filter(
                    (colLi) => colLi.isDefault == true
                  )[0].Color),
                  (eventType = "GroupCalendar Other"),
                  (typeOfEvent = "Others"));

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
                    recEndDateTime = `${recED}T${
                      evt.end.dateTime.split("T")[1]
                    }`;
                  })
                : evt.recurrence && evt.recurrence.pattern.type == "daily"
                ? ((recEDate = new Date(evt.recurrence.range.endDate)),
                  (recED = recEDate.toISOString().split("T")[0]),
                  (recEndDateTime = `${recED}T${
                    evt.end.dateTime.split("T")[1]
                  }`))
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
                          }`,
                    iniialDtate: evt.start.dateTime,
                    display: "block",
                    attendees: evt.attendees,
                    description: evt.bodyPreview,
                    backgroundColor: eventColor,
                    borderColor: eventColor,
                    allDay: evt.isAllDay,
                    itemFrom: eventType,
                    typeOfEvent: typeOfEvent,
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
                          }`,
                    // end: recEndDateTime,
                    display: "block",
                    attendees: evt.attendees,
                    description: evt.bodyPreview,
                    backgroundColor: eventColor,
                    borderColor: eventColor,
                    allDay: evt.isAllDay,
                    itemFrom: eventType,
                    typeOfEvent: typeOfEvent,
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
                : evt.recurrence &&
                  evt.recurrence.pattern.type == "absoluteMonthly"
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
                          }`,
                    // end: evt.end.dateTime,
                    display: "block",
                    attendees: evt.attendees,
                    description: evt.bodyPreview,
                    backgroundColor: eventColor,
                    borderColor: eventColor,
                    allDay: evt.isAllDay,
                    itemFrom: eventType,
                    typeOfEvent: typeOfEvent,
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
                : evt.recurrence &&
                  evt.recurrence.pattern.type == "relativeMonthly"
                ? {
                    id: evt.id,
                    title: evt.subject,
                    start: evt.start.dateTime,
                    end:
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
                          }`, // will also accept '20120201',
                    // end: evt.end.dateTime,
                    display: "block",
                    attendees: evt.attendees,
                    description: evt.bodyPreview,
                    backgroundColor: eventColor,
                    borderColor: eventColor,
                    allDay: evt.isAllDay,
                    itemFrom: eventType,
                    typeOfEvent: typeOfEvent,
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
                    backgroundColor: eventColor,
                    borderColor: eventColor,
                    allDay: evt.isAllDay,
                    itemFrom: eventType,
                    typeOfEvent: typeOfEvent,
                    //  description: evt.bodyPreview,
                  };
            });
            console.log("data", data);
            data = [...data];
            setEvents(data);
            setMasterEvents(data);
            setRender(false);
            setRender(true);
          });
      });
  };

  const handleRenderData = (item) => {
    let _selectedItems = [];
    if (item) {
      if (item.key == "Select All") {
        if (item.selected) {
          _selectedItems = dropdownvalue.map((value) => value.key);
        } else {
          _selectedItems = [];
        }
      } else {
        _selectedItems = item.selected
          ? [...selectedKeys, item.key]
          : selectedKeys.filter(
              (key) => key !== item.key && key != "Select All"
            );

        if (
          _selectedItems.filter((_filter) => _filter != "Select All").length ==
          dropdownvalue.filter((filter) => filter.key != "Select All").length
        ) {
          _selectedItems.unshift("Select All");
        }
      }
    }
    setSelectedKeys(_selectedItems);

    if (_selectedItems.length > 0) {
      let _filteredEvents = masterEvents;
      _arrFilterEvent = [];
      let currentDate = moment().format("DDMMYYYY");

      _filteredEvents = _filteredEvents.filter((event) => {
        return (
          _selectedItems.some(
            (_b) => _b.toLowerCase() == event.typeOfEvent.toLowerCase()
          ) &&
          parseInt(moment(event.start).format("DDMMYYYY")) <=
            parseInt(currentDate) &&
          parseInt(moment(event.end).format("DDMMYYYY")) >=
            parseInt(currentDate)
        );
      });
      console.log(_filteredEvents, "filterdata");
      for (let i = 0; _filteredEvents.length > i; i++) {
        if (
          parseInt(moment(_filteredEvents[i].start).format("DDMMYYYY")) ==
            parseInt(currentDate) &&
          parseInt(moment(_filteredEvents[i].end).format("DDMMYYYY")) ==
            parseInt(currentDate)
        ) {
          let curStartHour: string = moment(_filteredEvents[i].start)
            .hours()
            .toString();
          let curStartMin: string = moment(_filteredEvents[i].start)
            .minutes()
            .toString();
          let curStartSec: string = moment(_filteredEvents[i].start)
            .seconds()
            .toString();
          let curStartMillSec: string = moment(_filteredEvents[i].start)
            .milliseconds()
            .toString();
          let curStartTime: number = parseInt(
            curStartHour + curStartMin + curStartSec + curStartMillSec
          );
          let curEndHour: string = moment(_filteredEvents[i].end)
            .hours()
            .toString();
          let curEndMin: string = moment(_filteredEvents[i].end)
            .minutes()
            .toString();
          let curEndSec: string = moment(_filteredEvents[i].end)
            .seconds()
            .toString();
          let curEndMillSec: string = moment(_filteredEvents[i].end)
            .milliseconds()
            .toString();
          let curEndTime: number = parseInt(
            curEndHour + curEndMin + curEndSec + curEndMillSec
          );
          let curStartDate: any = moment().format("YYYY-MM-DDT00:00:00.000Z")
          let curEndDate: any = moment().format("YYYY-MM-DDT23:59:59.000Z")
          _arrFilterEvent.push({
            allDay: _filteredEvents[i].allDay,
            attendees: _filteredEvents[i].attendees,
            backgroundColor: _filteredEvents[i].backgroundColor,
            borderColor: _filteredEvents[i].borderColor,
            description: _filteredEvents[i].description,
            display: _filteredEvents[i].display,
            id: _filteredEvents[i].id,
            itemFrom: _filteredEvents[i].itemFrom,
            title: _filteredEvents[i].title,
            typeOfEvent: _filteredEvents[i].typeOfEvent,
            start:
              curStartTime == 0
                ? curStartDate
                : _filteredEvents[i].start,
            end:
              curEndTime == 0
                ? curEndDate
                : _filteredEvents[i].end,
          });
        } else {
          let curStartDate: any = moment().format("YYYY-MM-DDT00:00:00.000Z")
          let curEndDate: any = moment().format("YYYY-MM-DDT23:59:59.000Z")
          _arrFilterEvent.push({
            allDay: _filteredEvents[i].allDay,
            attendees: _filteredEvents[i].attendees,
            backgroundColor: _filteredEvents[i].backgroundColor,
            borderColor: _filteredEvents[i].borderColor,
            description: _filteredEvents[i].description,
            display: _filteredEvents[i].display,
            id: _filteredEvents[i].id,
            itemFrom: _filteredEvents[i].itemFrom,
            title: _filteredEvents[i].title,
            typeOfEvent: _filteredEvents[i].typeOfEvent,
            start: curStartDate,
            end: curEndDate,
          });
        }
      }
      debugger;
      console.log("_arrFilterEvent > ", _arrFilterEvent);

      setEvents(_arrFilterEvent);
      // setEvents(_filteredEvents);
    } else {
      if (_selectedItems.length == 0) {
        let currentDate = moment().format("DDMMYYYY");
        // console.log(currentDate);

        let _todayevents = masterEvents;

        _todayevents = _todayevents.filter((res) => {
          return (
            parseInt(moment(res.start).format("DDMMYYYY")) <=
              parseInt(currentDate) &&
            parseInt(moment(res.end).format("DDMMYYYY")) >=
              parseInt(currentDate)
          );
        });
        console.log(_todayevents, "today events");

        setTodayevents(_todayevents);
      }
      setEvents(masterEvents);
    }
  };

  const getImageURLFunction = (typeOfEvent) => {
    let filteredArr = listColor.filter((item) => item.Title == typeOfEvent);
    if (filteredArr.length > 0 && filteredArr[0].Icon) {
      let imgObj = JSON.parse(filteredArr[0].Icon);
      return imgObj ? imgObj.serverRelativeUrl : "";
    } else {
      let defaultFilteredArr = listColor.filter(
        (item) => item.Title == "Default"
      );

      return defaultFilteredArr.length > 0
        ? JSON.parse(defaultFilteredArr[0].Icon).serverRelativeUrl
        : "";
    }
  };

  useEffect(() => {
    getGroupEvents();
  }, []);
  useEffect(() => {
    if (render) {
      handleRenderData(eventItem);
      setRender(false);
    }
  }, [render]);
  return (
    <div className={styles.Rightcontainer}>
      <CalendarView calendarValue={events} />

      <div className={styles.RightSection}>
        <Dropdown
          placeholder="Category"
          label="Highlights of  Today"
          onChange={(_, e) => {
            setRender(true);
            setEventItem(e);
            console.log(e);
          }}
          selectedKeys={selectedKeys}
          multiSelect
          options={dropdownvalue}
          style={{ width: "100%" }}
        />

        <div className={styles.scrollSection}>
          {(selectedKeys.length == 0 ? todayevents : events).map((res) => {
            return (
              <div className={styles.RightDisplaydata}>
                <img
                  src={getImageURLFunction(res.typeOfEvent)}
                  width={20}
                  height={20}
                />
                <p style={{ margin: 0 }}>{res.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default App;
