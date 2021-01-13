import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  RefObject,
  CSSProperties
} from "react";
import { GetItemPropsOptions, useCombobox } from "downshift";

interface GetItemStylesProps {
  highlighted?: boolean;
}

export interface AutoSuggestProps {
  suggestions: { [_: string]: string[] };
  value: string;
  onChange: (_: string) => void;
  renderInput?: (props: {
    getInputProps: () => any;
    ref: RefObject<HTMLInputElement>;
    value: string;
    onChange: (_: string) => void;
  }) => ReactNode;
  renderList?: (props: {
    getMenuProps: () => any;
    getMenuStyles: () => CSSProperties;
    getItemProps: (options: GetItemPropsOptions<string>) => any;
    getItemStyles: (props?: GetItemStylesProps) => CSSProperties;
    isOpen: boolean;
    items: string[];
    highlightedIndex: number;
  }) => ReactNode;
  style?: CSSProperties;
  fontStyle?: CSSProperties;
  inputStyle?: CSSProperties;
}

export const AutoSuggest = ({
  suggestions,
  value,
  onChange,
  renderInput,
  renderList,
  style,
  fontStyle,
  inputStyle
}: AutoSuggestProps) => {
  const inputEl = useRef<HTMLInputElement>(null);

  const [nextCaretPosition, setNextCaretPosition] = useState<
    number | undefined
  >(undefined);
  const [caretPosition, setCaretPosition] = useState<number>(0);
  const [inputItems, setInputItems] = useState<string[]>([]);
  const [suggestionWasSelected, setSuggestionWasSelected] = useState<boolean>(
    false
  );

  const getMenuStyles = (): CSSProperties => ({
    flexShrink: 0
  });

  const getItemStyles = (props?: GetItemStylesProps): CSSProperties => ({
    background: props && props.highlighted ? "#F5F5F5" : "#FFFFFF"
  });

  const {
    isOpen,
    highlightedIndex,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    openMenu,
    closeMenu
  } = useCombobox({
    items: inputItems,
    selectedItem: null,

    // Triggered when an item is chose from the suggestion menu
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }

      const lastWordIndexMatch = /(?<=\s*)(\S+)$/gm.exec(
        value.slice(0, caretPosition)
      );
      const lastWordIndex = lastWordIndexMatch ? lastWordIndexMatch.index : 0;
      const lastWordMatch = value.slice(lastWordIndex).match(/^\S+/gm);
      const lastWord = lastWordMatch ? lastWordMatch[0] : "";
      const item = selectedItem || "";

      // If the last word is a symbol then just concatenate the item with
      // the current value and add a space
      if (suggestions[lastWord] !== undefined) {
        onChange(
          value.slice(0, caretPosition) +
            item +
            " " +
            value.slice(caretPosition)
        );
        setNextCaretPosition(caretPosition + item.length + 1);
        // Else you replace the value after the symbol with the item (that
        // way you override the item that was being written)
      } else {
        onChange(
          value.slice(0, lastWordIndex) +
            value
              .slice(lastWordIndex)
              .replace(new RegExp(lastWord.slice(1)), item)
        );
        setNextCaretPosition(caretPosition + item.length);
      }
      setSuggestionWasSelected(true);
      setInputItems([]);
      closeMenu();
    }
  });

  // Listen for the special keys that will finish the current suggestion
  const handleInputKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === " ") {
      setInputItems([]);
    }
  }, []);

  // Listen for updating caret postion
  const handleInputKeyUp = useCallback((event: KeyboardEvent) => {
    setCaretPosition((event.target as any).selectionStart);
  }, []);

  // Link the listeners to the input
  useEffect(() => {
    const el = inputEl.current;

    if (el !== null && el !== undefined) {
      el.addEventListener("keydown", handleInputKeyDown);
      el.addEventListener("keyup", handleInputKeyUp);
    }
    return () => {
      if (el !== null && el !== undefined) {
        el.removeEventListener("keydown", handleInputKeyDown);
        el.removeEventListener("keyup", handleInputKeyUp);
      }
    };
  }, [handleInputKeyDown, handleInputKeyUp]);

  // Manually set caret in the input when nextCaretPosition get a value
  useEffect(() => {
    if (nextCaretPosition !== undefined) {
      if (inputEl.current !== null && inputEl.current !== undefined) {
        inputEl.current.setSelectionRange(nextCaretPosition, nextCaretPosition);
      }
      setCaretPosition(nextCaretPosition);
      setNextCaretPosition(undefined);
    }
  }, [nextCaretPosition]);

  // When the form value change, update the suggestions accordingly
  useEffect(() => {
    if (suggestionWasSelected) {
      setSuggestionWasSelected(false);
    } else if (value === "") {
      setInputItems([]);
    } else {
      const lastWordMatch = value
        .slice(0, caretPosition)
        .match(/(?<=\s*)([\S]+)$/gm);
      const lastWord = lastWordMatch ? lastWordMatch[0] : "";
      const currentSuggestion = lastWord.slice(0, 1);

      if (suggestions[currentSuggestion] !== undefined) {
        setInputItems(
          suggestions[currentSuggestion].filter(
            item =>
              item.toLowerCase().startsWith(lastWord.slice(1).toLowerCase()) &&
              item.toLowerCase() !== lastWord.slice(1).toLowerCase()
          )
        );
      } else {
        setInputItems([]);
      }
    }
  }, [value, caretPosition, suggestions, suggestionWasSelected]);

  useEffect(() => {
    if (inputItems.length > 0 && !isOpen) {
      openMenu();
    } else if (inputItems.length === 0) {
      closeMenu();
    }
  }, [inputItems, closeMenu, openMenu, isOpen]);

  return (
    <div
      {...getComboboxProps()}
      style={{ position: "relative", display: "inline-flex", ...style }}
    >
      {!!renderInput ? (
        renderInput({ getInputProps, ref: inputEl, value, onChange })
      ) : (
        <input
          {...getInputProps({ ref: inputEl })}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          zIndex: 1000,
          width: "100%",
          marginTop: "2rem"
        }}
      >
        <div
          style={{
            fontFamily: "inherit",
            visibility: "hidden",
            boxSizing: "border-box",
            minWidth: 0,
            marginRight: "-1rem",
            ...fontStyle
          }}
        >
          {value.slice(0, caretPosition)}
        </div>
        {!!renderList ? (
          renderList({
            getMenuProps: () => ({ ...getMenuProps(), style: getMenuStyles() }),
            getMenuStyles,
            getItemProps: (options: GetItemPropsOptions<string>) => ({
              ...getItemProps(options),
              style: getItemStyles()
            }),
            getItemStyles,
            isOpen: isOpen,
            items: inputItems,
            highlightedIndex
          })
        ) : (
          <ul
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1),0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              borderRadius: 4,
              overflow: "hidden",
              flexShrink: 0,
              padding: 0,
              margin: 0,
              height: "min-content"
            }}
            {...getMenuProps()}
          >
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  style={{
                    fontFamily: "inherit",
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                    paddingTop: "0.25rem",
                    paddingBottom: "0.25rem",
                    listStyleType: "none",
                    margin: 0,
                    ...getItemStyles({
                      highlighted: highlightedIndex === index
                    }),
                    ...fontStyle
                  }}
                  {...getItemProps({ item, index })}
                  key={`${index}-${item}`}
                >
                  {item}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutoSuggest;
