"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function DatePickerInput({
  value,
  onChange,
  placeholder = "Select date",
  required,
}: DatePickerInputProps) {
  const selected = value ? new Date(value + "T00:00:00") : null;

  return (
    <div className="date-picker-wrapper">
      <DatePicker
        selected={selected}
        onChange={(date: Date | null) => {
          if (date) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            onChange(`${yyyy}-${mm}-${dd}`);
          } else {
            onChange("");
          }
        }}
        dateFormat="MM/dd/yyyy"
        placeholderText={placeholder}
        required={required}
        className="date-picker-input"
        calendarClassName="date-picker-calendar"
        showPopperArrow={false}
        isClearable
      />
    </div>
  );
}
