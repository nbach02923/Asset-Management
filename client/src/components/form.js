import React, { useState } from "react";
import { InputLabel, TextField, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const Form = ({ fields }) => {
	const [values, setValues] = useState(
		fields.reduce((acc, field) => {
			acc[field.label] = field.value;
			return acc;
		}, {})
	);
	const handleChange = (label, value) => {
		setValues((prevValues) => ({
			...prevValues,
			[label]: value,
		}));
	};
	return (
		<form>
			{fields.map((field) => {
				switch (field.type) {
					case "text":
						return (
							<div key={field.label}>
								<InputLabel id={field.label}>{field.label}</InputLabel>
								<TextField
									size="small"
									fullWidth
									value={values[field.label]}
									onChange={(event) => {
										handleChange(field.label, event.target.value);
										field.onChange(event);
									}}
									disabled={field.disabled}
								/>
							</div>
						);
					case "select":
						return (
							<div key={field.label}>
								<InputLabel id={field.label}>{field.label}</InputLabel>
								<Select
									labelId={field.label}
									size="small"
									fullWidth
									value={values[field.label] || ""}
									onChange={(event) => {
										handleChange(field.label, event.target.value);
										field.onChange(event);
									}}
									disabled={field.disabled}>
									{field.options.map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</Select>
							</div>
						);
					case "radio":
						return (
							<div key={field.label}>
								<InputLabel id={field.label}>{field.label}</InputLabel>
								<RadioGroup
									sx={{ display: "flex", justifyContent: "space-evenly" }}
									row={field.direction === "row"}
									disabled={field.disabled}>
									{field.values.map((value) => (
										<FormControlLabel key={value} value={value} control={<Radio />} label={value} />
									))}
								</RadioGroup>
							</div>
						);
					case "textarea":
						return (
							<div key={field.label}>
								<InputLabel id={field.label}>{field.label}</InputLabel>
								<TextField
									size="small"
									fullWidth
									multiline
									value={values[field.label]}
									onChange={(event) => {
										handleChange(field.label, event.target.value);
										field.onChange(event);
									}}
									disabled={field.disabled}
								/>
							</div>
						);
					default:
						return null;
				}
			})}
		</form>
	);
};
export default Form;
