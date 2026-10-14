---
layout: markdown-page
title: Schedule Calendar Guide
---

<style>
   li { margin-bottom: .5rem }
</style>

- [Moving from your AFS File](#moving-from-previous-afs-file)
- [Creating The Schedule File](#creating-the-schedule-file)
- [Populating Your Days Off](#populating-your-days-off)

### Moving From Previous AFS File

This section shows how one might transfer from entering their times in afs to entering their times into a Google calendar. 

**Save a copy of your schedule file, the google calendar will overwrite it**

If you did not do this and now need it back, Cannon has them all saved as of 2022-07-15. 

#### Create an ics file from your current file in afs

Login to moria

```shell
cd /p/condor/public/html/htcondor/developers/schedules

source generate_personal_ics.sh <your_file_name>
```

If an error is reported in your schedule file you can fix it or ignore it and that event just won't be added. 

Grab the ics file from this build and import it into your calendar you create [below](#creating-the-schedule-file). 

This can be done on the [import page](https://calendar.google.com/calendar/u/0/r/settings/export).

Don't forget to also create your new [schedule file](#creating-the-schedule-file) which holds your schedule meta-data.

### Creating The Schedule File

This section will describe how to create your yaml file, you can find a verbose template file on [afs](https://research.cs.wisc.edu/htcondor/developers/schedules/sample_yaml_schedule.html) or use the one below.

**\<filename>.yml**
```
Name: "name"
ShortName: "shortname"
corehours: "corehours"
DailyEmail: "Yes" # ( or omit line entirely )
Email: "email"
Office: "location"
Phone: "phone" # Office and/or Cell - This is read as a string so format how you want
calendarurl: "calendarurl"
default:
  starttime: "starttime"
  endtime: "endtime"
  status: "status"
```
##### File Details

- **Name**: First Last
- **ShortName**: (Optional, defaults to First Name if not specified) Should be unique and obviously you. If your name is "George Washington" and George Foreman also works in your group, "GeorgeW" would be a good choice.
- **corehours**: A description of your corehours that is displayed. Format is not important. Example is "9:00 AM to 5:00 PM"
- **DailyEmail**: If ‘Yes’ then you will receive a daily email with who is out, otherwise should be omitted entirely.
- **Email**: Your preferred email address. Defaults to filename@cs.wisc.edu so you will likely want to change this
- **Office**: Your office location. Example => "4261 CS"
- **Phone**: Your phone number(s). Example => "+1 608 265 5736 (office) <br> +1 608 576 0351 (cell)"
- **DailyEmail**: Do you want a daily email with information about who is gone?
- **calendarurl**: The url to your outage calendar. Details on obtaining this found [below](#creating-your-ical-url).
- **starttime**: Your typical start time, use military format. Example => "09:00"
- **endtime**: Your typical end time, use military format. Example => "17:00"
- **status**: Your status during these hours. If you are unsure use "Office".
- **default\[Monday, Tuesday, Wednesday, Thursday, Friday]**: This overwrites the default for that day. Use the same format as default.

**Important**

All of these data strings have to be encased in double quotations to be valid yaml. This encasement can be seen in the template file.

#### Creating Your ICAL URL

To power your outage calendar you need to create a google calendar which is solely used to populate your outages.

1. Go to [https://calendar.google.com/](https://calendar.google.com/) and sign in with your preferred account. You can use @morgridge.org and @wisc.edu.
2. Create a new calendar
    - Name and Description do not matter
    - ![Add Container Image](../../images/docs/add_new_calendar.jpg)

3. Go into Calendar settings and retrieve the Secret Address
    - Go to calendar Settings
      ![Go to Calendar Settings](../../images/docs/go_to_calendar_settings.jpg)
    - Get the secret calendar url ( Will warn not to give this out )  
      ![Get Secret Calendar URL](../../images/docs/get_calendar_url.jpg)

4. Post this address into your yaml file as the calendarurl

### Populating Your Days Off

#### Event Title

The event title should be one of the statuses bolded below. These statuses are 
used to key the type of outage so anything but a approved status should be in the event title.

- **Travel**:   Working, but not at the office. Perhaps a conference
- **Vacation**: Taking vacation ("vacation" and "personal holiday" on the leave report)
- **Sick**:     Taking sick leave ("sick leave" on the leave report)
- **Holiday**:  Taking floating holiday ("legal holiday" on the leave report)
- **Furlough**: State- or UW-mandated furlough (as required). Includes both fixed ("mandatory") and floating time.
- **Off**:      Days not worked on a part-time employment
- **WFH**: Work From Home
 
#### Event Description

Any description of the outage you would like to add can be added in the event 
description.

#### Marking Event Time

##### Marking Full day/days Out

To mark full day outages you create an event with the "All day" attribute ticked ( This is used in the demo above ). Populate the title and description as expected.

**Do not use the recurring event feature for multiple outage days.**

##### Marking Partial Outages

To mark partial time you must do two different things.

1. Append the amount of hours this outage is taking with a colon separating the title.
   - For Example, if you have a four hour doctor appt. you would mark SICK:4
   - For Example, if you leave for vacation half a day early you would mark VACATION:4

2. Mark the time you are _*in*_ the office on Google
   - This is non-intuitive but when you are marking time you mark the time you are in.
   - For Example, if I am normally in 9-5 and am leaving 4 hours early I will mark my event to go from 9:00 AM to 1:00 PM.

#### Example

If you mark your title in Google as "Sick" and the description as "Wisdom Tooth Surgery and Recovery" the schedule output will be as so.

![Google Event Demo](../../images/docs/demo_outage.jpg)

![Google Event Demo Schedule App](../../images/docs/demo_outage_schedule_app.jpg)


