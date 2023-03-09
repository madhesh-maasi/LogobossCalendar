import * as React from "react";
import { useState, useEffect } from "react";
import styles from "./CustomCalendar.module.scss";
import CalendarView from "./CalendarView";
let timeZone = "India Standard Time"; //for local time zone
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import * as moment from "moment";
let headers = { Prefer: 'outlook.timezone="' + timeZone + '"' };
let data = [];
let listColor = [];
let dropdownvalue = [];
const App = (props) => {
  const [masterEvents, setMasterEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const [render,setRender] = useState(false);
  const [eventItem,setEventItem]=useState({})
  const getGroupEvents = async () => {
    // 5f5263bc-2144-4b8b-9eb0-2d225dfc6de1

    await props.spcontext.web.lists
      .getByTitle("LoggoCalender")
      .items.get()
      .then((res: any) => {
        console.log(res, "res");
        listColor = res;
        dropdownvalue = [];
        res.forEach((col) => {
          if (col.Title != "Default") {
            dropdownvalue.push({
              key: col.Title,
              text: col.Title,
            });
          }

          console.log(col.Color);
        });

        console.log(dropdownvalue);
        setColor(listColor);
        console.log("listcolor", listColor);
        //////////calenderdata

        props.graphcontext.groups
          .getById("5f5263bc-2144-4b8b-9eb0-2d225dfc6de1")
          .events.configure({ headers })
          .top(999)()
          .then((result: any) => {
            // console.log(result);
            // let data1 = [];
            let recEndDateTime;
            let recEDate;
            data = result.map((evt) => {
              let recED = "";
              let eventColor = "";
              let eventType = "";
              let eventColorArr = listColor.filter((colLi) => {
                return evt.subject
                  .toLowerCase()
                  .includes(colLi.Title.toLowerCase());
              });
              eventColorArr.length > 0
                ? ((eventColor = eventColorArr[0].Color),
                  (eventType = "GroupCalendar"))
                : ((eventColor = listColor.filter(
                    (colLi) => colLi.isDefault == true
                  )[0].Color),
                  (eventType = "GroupCalendar Other"));

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
                    //  description: evt.bodyPreview,
                  };
            });
            console.log("data", data);
            data = [...data];
            setEvents(data);
            setMasterEvents(data);
            setRender(false)
            setRender(true)
          });
      });
  };

  const handleRenderData = (item) => {
    let _selectedItems = [];
    if (item) {
      _selectedItems = item.selected
        ? [...selectedKeys, item.key]
        : selectedKeys.filter((key) => key !== item.key);
    }
    setSelectedKeys(_selectedItems);

    if (_selectedItems.length > 0) {
      let _filteredEvents = masterEvents;
      let currentDate = moment(new Date()).format("YYYY-MM-DD");
      currentDate=currentDate+"T00.00.00.000Z";

      _filteredEvents = _filteredEvents.filter((event) => {
        return (
          (_selectedItems.some((_b) => _b == "Birthday") &&
            event.backgroundColor == "green" &&  moment(event.start).format() >currentDate ) ||
          (_selectedItems.some((_v) => _v == "Vacation") &&
            event.backgroundColor == "blue" && moment(event.start).format() >currentDate)
        );
      });
      console.log(_filteredEvents, "filterdata");

      setEvents(_filteredEvents);
    } else {
      if (_selectedItems.length == 0) {
        let currentDate = moment(new Date()).format("YYYY-MM-DD");
        // console.log(currentDate);
        currentDate=currentDate+"T00.00.00.000Z";

        let _todayevents = masterEvents;

        _todayevents = _todayevents.filter((res) => 
        {
         
          return (
           
            moment(res.start).format() >currentDate 
            // moment(res.end).format("DD/MM/YYYY") <= currentDate
          );
        });
        console.log(_todayevents, "today events");

        setEvents(_todayevents);
      }
    }
  };

  useEffect(() => {
    getGroupEvents();
  }, []);
useEffect(()=>{
  if(render){
    handleRenderData(eventItem);
    setRender(false)
  }
},[render]);
  return (
    <div style={{ display: "flex", width: "70%", gap: "20px" }}>
      <CalendarView calendarValue={events} />
      <div
        style={{
          background: " #FFFFFF",
          boxShadow: "-2px 0px 6px rgba(0, 0, 0, 0.25)",
          borderRadius: "2px",
        }}
      >
        <Dropdown
          placeholder="Select options"
          label="Events"
          onChange={(_,e)=>{setRender(true);setEventItem(e)}}
          selectedKeys={selectedKeys}
          multiSelect
          options={dropdownvalue}
          style={{ width: "300px" }}
        />
        {events.slice(0, 5).map((res) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#FFFFFF",
                margin: "10px 0px",
                gap: "10px",
                padding: "10px",
                boxShadow: "-2px 0px 6px rgba(0, 0, 0, 0.25)",
                borderRadius: " 5px,",
              }}
            >
              <img
                src={
                  res.backgroundColor == "green"
                    ? "https://cdn-icons-png.flaticon.com/512/4525/4525667.png"
                    : ""
                }
                width={20}
                height={20}
              />
              <p style={{ margin: 0 }}>{res.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default App;
