import * as React from "react";
import styles from "./CustomCalendar.module.scss";
import { ICustomCalendarProps } from "./ICustomCalendarProps";
import { escape } from "@microsoft/sp-lodash-subset";
import App from "./App";
import "./Calendar.scss";
export default class CustomCalendar extends React.Component<
  ICustomCalendarProps,
  {}
> {
  public render(): React.ReactElement<ICustomCalendarProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <App
        spcontext={this.props.spcontext}
        graphcontext={this.props.graphcontext}
      />
    );
  }
}
