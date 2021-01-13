import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import MenuItem from "@material-ui/core/MenuItem";

import { AutoSuggest, AutoSuggestProps } from "../src";

export default {
  title: "Autocomplete",
  component: AutoSuggest
};

export const NoStyle = (args: AutoSuggestProps) => {
  const [value, setValue] = useState("");
  return (
    <AutoSuggest
      suggestions={args.suggestions}
      value={value}
      onChange={setValue}
    />
  );
};

NoStyle.args = {
  suggestions: {
    "@": ["Fouquets", "DunkinDonuts", "Walmart"],
    "#": ["DinnerWithFriends", "BreakfastAtWork", "Grosseries"]
  },
  value: "",
  onChange: () => {}
};

export const MaterialUI = (args: AutoSuggestProps) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <AutoSuggest
        suggestions={args.suggestions}
        value={value}
        onChange={setValue}
        renderInput={({ getInputProps, ref, value, onChange }) => (
          <TextField
            {...getInputProps()}
            value={value}
            onChange={event => onChange(event.target.value)}
            inputRef={ref}
          />
        )}
        renderList={({
          getMenuProps,
          getItemProps,
          getItemStyles,
          isOpen,
          items,
          highlightedIndex
        }) => (
          <Card {...getMenuProps()}>
            {isOpen &&
              items.map((item, index) => (
                <MenuItem
                  {...getItemProps({ item, index })}
                  key={`${index}-${item}`}
                  style={getItemStyles({
                    highlighted: highlightedIndex === index
                  })}
                >
                  {item}
                </MenuItem>
              ))}
          </Card>
        )}
      />
    </div>
  );
};

MaterialUI.args = {
  suggestions: {
    "@": ["Fouquets", "DunkinDonuts", "Walmart"],
    "#": ["DinnerWithFriends", "BreakfastAtWork", "Grosseries"]
  },
  value: "",
  onChange: () => {}
};
