const createField = (label, type, value, onChange, disabled = false) => {
	return {
		label,
		type,
		value,
		onChange: (event) => onChange(event.target.value),
		disabled,
	};
};
const createSelectField = (
	label,
	options,
	value,
	onChange,
	items = null,
	setSelectedId = null,
	idProperty = "id",
	disabled = false
) => {
	return {
		label,
		type: "select",
		options,
		value,
		onChange: (event) => {
			onChange(event.target.value);
			if (items && setSelectedId) {
				const selectedName = event.target.value;
				const selectedItem = items.find((item) => item.name === selectedName);
				setSelectedId(selectedItem[idProperty]);
			}
		},
		disabled,
	};
};
const createRadioField = (label, values, value, onChange, direction, disabled = false) => {
	return {
		label,
		type: "radio",
		values,
		value,
		onChange: (event) => onChange(event.target.value),
		direction,
		disabled,
	};
};

const createAllField = { createField, createSelectField, createRadioField };
export default createAllField;
