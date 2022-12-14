import {
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemButton,
  MenuItem,
  Radio,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect } from "react";

import {
  getFunctionList,
  getFunctionListByTargetUI,
} from "../BuiltinFunctionList";

type CommandRowProps = {
  rowId: number;
  radioSelected: boolean;
  functionValue: String;
  targetUI: String | null;

  OnFunctionChange: (fnName: String) => void;
  OnRadioSelect: (id: number) => void;
  OnDelete: () => void;
};

export default function CommandRow(prop: CommandRowProps) {
  let functionList = getFunctionListByTargetUI(prop.targetUI || "Ext");

  // useEffect(() => console.log(functionList), [functionList]);

  const [func, setFunc] = React.useState(functionList[0]);

  const handleChange = (event: any) => {
    prop.OnFunctionChange(event.target.value);
    // setFunc(event.target.value);
  };

  const handleRadioChange = (event: any) => {
    prop.OnRadioSelect(event.target.value);
  };

  return (
    <ListItem>
      <Radio
        checked={prop.radioSelected}
        onChange={handleRadioChange}
        value={prop.rowId}
        name="radio-buttons"
      />
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120, width: 1 }}>
        <InputLabel id="demo-simple-select-standard-label">Command</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={prop.functionValue}
          onChange={handleChange}
          label="Command"
        >
          {functionList.map(([name, displayName]) => (
            <MenuItem value={name}>{displayName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton onClick={prop.OnDelete} edge="end" aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
