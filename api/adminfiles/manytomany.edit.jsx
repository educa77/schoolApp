import React, { useState, useEffect } from "react";
import { ApiClient } from "admin-bro";
import { Label } from "@admin-bro/design-system";
import Select from "react-select";
import styled from "styled-components";

const getOptionsFromRecords = (records) => {
  return records.map((r) => ({ value: r.params.id, label: r.params.name }));
};

const getItems = (record, name) => {
  if (record.populated && record.populated[name]) {
    return getOptionsFromRecords(record.populated[name]);
  }
  return [];
};

const ResourceSelection = (props) => {
  const { onChange, name, selected: initialSelection, resourceId, message } = props;
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(initialSelection);

  const api = new ApiClient();

  const loadOptions = async (inputValue) => {
    const records = await api.searchRecords({
      resourceId: resourceId,
      query: inputValue,
    });
    const options = getOptionsFromRecords(records);
    setOptions(options);
    return options;
  };

  const handleChange = (selectedOptions) => {
    setSelected(selectedOptions);
    selectedOptions != null
      ? onChange(
          name,
          selectedOptions.map((v) => v.value)
        )
      : onChange(name, null);
  };

  useEffect(() => {
    loadOptions();
    return () => {
      setOptions({});
    };
  }, []);

  return (
    <>
      {options &&
        options.length > 0 &&
        (message === undefined ? (
          <Select
            isMulti
            defaultOptions
            options={options}
            value={selected}
            onChange={handleChange}
          />
        ) : (
          <SelectMessage
            isMulti
            defaultOptions
            options={options}
            value={selected}
            onChange={handleChange}
          />
        ))}
    </>
  );
};

const ManyToManyEdit = (props) => {
  const { property, record, onChange, message } = props;
  const items = record.populated ? getItems(record, property.name) : [];

  return (
    <>
      {message ? (
        <LabelMessage>{property.label}</LabelMessage>
      ) : (
        <Label required>{property.label}</Label>
      )}
      <ResourceSelection
        onChange={onChange}
        name={property.name}
        resourceId={property.name}
        selected={items}
        message={message}
      />
      {message ? <Message>{message}</Message> : ""}
    </>
  );
};

export default ManyToManyEdit;

const Message = styled.span`
  color: red;
  font-size: 10px;
`;

const LabelMessage = styled(Label)`
  color: red;
`;

const SelectMessage = styled(Select)`
  border: 1px solid red;
`;
