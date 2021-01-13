# React Multi AutoSuggest

[![CI Actions Status](https://github.com/thomasrogerlux/react-multi-autosuggest/workflows/CI/badge.svg)](https://github.com/thomasrogerlux/react-multi-autosuggest/actions)

## Installation

```bash
yarn add react-multi-autosuggest
```

or if you use npm

```bash
npm install --save react-multi-autosuggest
```

## Usage

### Simple usage

```tsx
import React from "react";
import AutoSuggest from "react-multi-autosuggest";

const Form = () => {
  const [value, setValue] = useState("");

  const onSubmit = () => {
    // Your logic
  };

  return (
    <form onSubmit={onSubmit}>
      <AutoSuggest
        suggestions={{
          "@": ["John", "Lisa", "Matt"],
          "#": ["Outdoor", "Food", "Gaming"]
        }}
        value={value}
        onChange={setValue}
      />
    </form>
  );
};
```

### Usage with another component library

Simple example with Material UI

```tsx
import React from "react";
import AutoSuggest from "react-multi-autosuggest";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import MenuItem from "@material-ui/core/MenuItem";

const Form = () => {
  const [value, setValue] = useState("");

  const onSubmit = () => {
    // Your logic
  };

  return (
    <form onSubmit={onSubmit}>
      <AutoSuggest
        suggestions={{
          "@": ["John", "Lisa", "Matt"],
          "#": ["Outdoor", "Food", "Gaming"]
        }}
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
    </form>
  );
};
```

## Development

### Workflow

```bash
yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

### Storybook

```bash
yarn storybook
```

This loads the stories from `./stories`.

### Tests

Tests are setup with Jest

```bash
yarn test
```

### Build

```bash
yarn build
```

## License

MIT © [thomasrogerlux](https://github.com/thomasrogerlux)
