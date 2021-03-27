// Formats the current date to fit SQL's datetimeoffset field
const get_current_date_formatted = () => {

    // Adds zero prefix to datee/time/minute/etc if it not already 2 digits
    const add_zero_prefix = (time_value) => {
        if (time_value > 9) {
            return time_value;
        } else {
            return "0" + time_value;
        }
    }

    let formatted_date = "";
    let d = new Date();
    formatted_date += d.getFullYear();
    formatted_date += "-";
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let secs = d.getSeconds();
    let utc_offset = d.getTimezoneOffset();
    let utc_offset_is_positive = d.getTimezoneOffset() >= 0
    let utc_offset_hours = Math.floor(utc_offset / 60)
    let utc_offset_minutes = utc_offset % 60;

    formatted_date += add_zero_prefix(month)
    formatted_date += "-";
    formatted_date += add_zero_prefix(day)
    formatted_date += " ";
    formatted_date += add_zero_prefix(hours)
    formatted_date += ":";
    formatted_date += add_zero_prefix(minutes)
    formatted_date += ":";
    formatted_date += add_zero_prefix(secs)
    formatted_date += ".0000"
    formatted_date += " ";
    formatted_date += utc_offset_is_positive ? "+" : "-";
    formatted_date += add_zero_prefix(utc_offset_hours);
    formatted_date += ":"
    formatted_date += add_zero_prefix(utc_offset_minutes);

    // console.log(formatted_date);
    return formatted_date;
}

module.exports = {
    get_current_date_formatted,
}