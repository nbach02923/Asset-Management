import React from "react";
import { InputLabel, TextField, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from "@mui/material";

const Form = ({ fields }) => {
	return (
		<form>
			{fields.map((field) => {
				switch (field.type) {
					case "text":
						return (
							<div key={field.label}>
								<InputLabel id={field.label}>{field.label}</InputLabel>
								<TextField size="small" fullWidth />
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
									value={field.value || ""}
									onChange={field.onChange}>
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
								<RadioGroup>
									{field.values.map((value) => (
										<FormControlLabel
											key={value}
											value={value}
											control={<Radio />}
											label={value}
											fullWidth
										/>
									))}
								</RadioGroup>
							</div>
						);
					case "textarea":
						return (
							<div key={field.label}>
								<InputLabel id={field.label}>{field.label}</InputLabel>
								<TextField size="small" fullWidth multiline />
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
